import { randomUUID } from "node:crypto";
import type { ActorType, Event, Prisma } from "@prisma/client";
import { prisma } from "./db";
import { computeChainHash, GENESIS_HASH } from "./hashchain";
import { trackEventFunnel } from "./analytics";

// Advisory-lock key serialises chain appends so concurrent emits can't race.
const EVENT_LOCK = 911001;

export type EmitInput = {
  type: string;
  stage: number;
  studentId?: string | null;
  applicationId?: string | null;
  actorType: ActorType;
  actorId?: string | null;
  visibility?: Record<string, boolean>;
  channels?: Record<string, boolean>;
  payload?: Record<string, unknown>;
};

/** The exact, ordered content that gets hashed for an event. */
function eventContent(e: {
  id: string;
  type: string;
  stage: number;
  studentId: string | null;
  applicationId: string | null;
  actorType: ActorType;
  actorId: string | null;
  visibility: unknown;
  channels: unknown;
  payload: unknown;
  createdAt: Date;
}) {
  return {
    id: e.id,
    type: e.type,
    stage: e.stage,
    studentId: e.studentId,
    applicationId: e.applicationId,
    actorType: e.actorType,
    actorId: e.actorId,
    visibility: e.visibility,
    channels: e.channels,
    payload: e.payload,
    createdAt: e.createdAt,
  };
}

/** A Prisma client scoped to an open transaction. */
export type Tx = Prisma.TransactionClient;

/** The chain append itself, always running inside some transaction. */
async function appendEvent(tx: Tx, input: EmitInput): Promise<Event> {
  const id = randomUUID();
  const createdAt = new Date();
  const visibility = input.visibility ?? {};
  const channels = input.channels ?? { in_app: true };
  const payload = input.payload ?? {};
  const studentId = input.studentId ?? null;
  const applicationId = input.applicationId ?? null;
  const actorId = input.actorId ?? null;

  // Transaction-scoped advisory lock: serialises chain appends and is released
  // on commit/rollback, so it is safe to take inside a caller's transaction too.
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(${EVENT_LOCK})`;
  const prev = await tx.event.findFirst({
    orderBy: { seq: "desc" },
    select: { chainHash: true },
  });
  const prevHash = prev?.chainHash ?? GENESIS_HASH;
  const chainHash = computeChainHash(
    eventContent({
      id,
      type: input.type,
      stage: input.stage,
      studentId,
      applicationId,
      actorType: input.actorType,
      actorId,
      visibility,
      channels,
      payload,
      createdAt,
    }),
    prevHash,
  );
  return tx.event.create({
    data: {
      id,
      type: input.type,
      stage: input.stage,
      studentId,
      applicationId,
      actorType: input.actorType,
      actorId,
      visibility: visibility as Prisma.InputJsonValue,
      channels: channels as Prisma.InputJsonValue,
      payload: payload as Prisma.InputJsonValue,
      createdAt,
      chainHash,
    },
  });
}

/**
 * Append an event to the hash-chained log. Computes
 * chain_hash = sha256(content || prev_chain_hash) under an advisory lock so
 * the chain is gapless and deterministic.
 *
 * Pass `tx` to append inside a caller's transaction. Status is stored on the
 * entity as well as derived from events (CLAUDE.md §1.6), so the state write and
 * its event MUST commit together — otherwise a failure between them leaves a
 * document approved, an application submitted or a visa file signed off with no
 * corresponding entry in the log the audit trail is built from. `withEvents`
 * below is the ergonomic way to do that.
 */
export async function emit(input: EmitInput, tx?: Tx): Promise<Event> {
  const event = tx
    ? await appendEvent(tx, input)
    : await prisma.$transaction((t) => appendEvent(t, input));

  // Privacy-respecting analytics (G178): forward catalog events to the product
  // funnel. Fire-and-forget post-commit — never adds latency, never throws.
  void trackEventFunnel(input.type, { stage: input.stage }).catch(() => {});

  return event;
}

/**
 * Run state writes and their event(s) in one transaction:
 *
 *   await withEvents(async (tx) => {
 *     await tx.document.update({ ... });
 *     await emit({ ... }, tx);
 *   });
 *
 * Either everything commits or nothing does.
 */
export async function withEvents<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  return prisma.$transaction(fn);
}

export type ChainVerifyResult = {
  ok: boolean;
  count: number;
  brokenAt?: { id: string; seq: string };
  /** True when the whole chain was recomputed from genesis, not just a window. */
  full: boolean;
};

/**
 * Recompute the event hash chain and report the first broken link, if any.
 *
 * `limit` verifies only the most recent N events, anchored on the stored
 * chainHash of the event immediately before the window — constant cost, and
 * still detects tampering inside the window. Without it the entire chain is
 * recomputed from genesis; that is the authoritative check, but the event log is
 * append-only with 6-year retention, so it must not run on every page render.
 */
export async function verifyEventChain(
  opts: { limit?: number } = {},
): Promise<ChainVerifyResult> {
  const total = await prisma.event.count();
  const limit = opts.limit;

  if (!limit || limit >= total) {
    const events = await prisma.event.findMany({ orderBy: { seq: "asc" } });
    let prevHash = GENESIS_HASH;
    for (const e of events) {
      const expected = computeChainHash(eventContent(e), prevHash);
      if (expected !== e.chainHash) {
        return { ok: false, count: events.length, brokenAt: { id: e.id, seq: String(e.seq) }, full: true };
      }
      prevHash = e.chainHash;
    }
    return { ok: true, count: events.length, full: true };
  }

  const recent = await prisma.event.findMany({ orderBy: { seq: "desc" }, take: limit });
  const events = recent.reverse();
  const anchor = await prisma.event.findFirst({
    where: { seq: { lt: events[0].seq } },
    orderBy: { seq: "desc" },
    select: { chainHash: true },
  });
  let prevHash = anchor?.chainHash ?? GENESIS_HASH;
  for (const e of events) {
    const expected = computeChainHash(eventContent(e), prevHash);
    if (expected !== e.chainHash) {
      return { ok: false, count: total, brokenAt: { id: e.id, seq: String(e.seq) }, full: false };
    }
    prevHash = e.chainHash;
  }
  return { ok: true, count: total, full: false };
}

/** Mark an event as read by a user (mutable state, outside the chain). */
export async function markEventRead(userId: string, eventId: string) {
  return prisma.eventRead.upsert({
    where: { userId_eventId: { userId, eventId } },
    create: { userId, eventId },
    update: { readAt: new Date() },
  });
}
