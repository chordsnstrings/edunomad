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

/**
 * Append an event to the hash-chained log. Computes
 * chain_hash = sha256(content || prev_chain_hash) under an advisory lock so
 * the chain is gapless and deterministic.
 */
export async function emit(input: EmitInput): Promise<Event> {
  const id = randomUUID();
  const createdAt = new Date();
  const visibility = input.visibility ?? {};
  const channels = input.channels ?? { in_app: true };
  const payload = input.payload ?? {};
  const studentId = input.studentId ?? null;
  const applicationId = input.applicationId ?? null;
  const actorId = input.actorId ?? null;

  const event = await prisma.$transaction(async (tx) => {
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
  });

  // Privacy-respecting analytics (G178): forward catalog events to the product
  // funnel. Fire-and-forget post-commit — never adds latency, never throws.
  void trackEventFunnel(input.type, { stage: input.stage }).catch(() => {});

  return event;
}

export type ChainVerifyResult = {
  ok: boolean;
  count: number;
  brokenAt?: { id: string; seq: string };
};

/** Recompute the whole event chain and report the first broken link, if any. */
export async function verifyEventChain(): Promise<ChainVerifyResult> {
  const events = await prisma.event.findMany({ orderBy: { seq: "asc" } });
  let prevHash = GENESIS_HASH;
  for (const e of events) {
    const expected = computeChainHash(eventContent(e), prevHash);
    if (expected !== e.chainHash) {
      return { ok: false, count: events.length, brokenAt: { id: e.id, seq: String(e.seq) } };
    }
    prevHash = e.chainHash;
  }
  return { ok: true, count: events.length };
}

/** Mark an event as read by a user (mutable state, outside the chain). */
export async function markEventRead(userId: string, eventId: string) {
  return prisma.eventRead.upsert({
    where: { userId_eventId: { userId, eventId } },
    create: { userId, eventId },
    update: { readAt: new Date() },
  });
}
