import { prisma } from "./db";
import { renderEventTemplate } from "./event-templates";
import type { Locale } from "../i18n/config";

// Map a role to its visibility short-code in Event.visibility (CLAUDE.md §7).
const ROLE_TO_CODE: Record<string, string> = {
  student: "S",
  parent: "P",
  counsellor: "C",
  operations_team: "O",
  operations_manager: "OM",
  counsellor_manager: "CM",
  compliance: "COMP",
  finance: "F",
  education_manager: "EM",
  super_admin: "ADMIN",
};

export function roleToVisibilityCode(role: string): string | undefined {
  return ROLE_TO_CODE[role];
}

export type FeedItem = {
  id: string;
  seq: string;
  type: string;
  stage: number;
  createdAt: string;
  rendered: string;
  read: boolean;
};

/**
 * Activity feed: events visible to a role (Event.visibility[code] === true),
 * optionally scoped to one student, cursor-paginated by seq, each with a
 * localized rendered string and a per-user read indicator.
 */
export async function getActivityFeed(opts: {
  roleShort: string;
  userId?: string;
  studentId?: string;
  locale: Locale;
  cursor?: string | null;
  limit?: number;
}): Promise<{ items: FeedItem[]; nextCursor: string | null }> {
  const limit = Math.min(50, Math.max(1, opts.limit ?? 20));

  const where: Record<string, unknown> = {
    visibility: { path: [opts.roleShort], equals: true },
  };
  if (opts.studentId) where.studentId = opts.studentId;
  if (opts.cursor) where.seq = { lt: BigInt(opts.cursor) };

  const rows = await prisma.event.findMany({
    where,
    orderBy: { seq: "desc" },
    take: limit + 1,
  });

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? String(page[page.length - 1].seq) : null;

  let readSet = new Set<string>();
  if (opts.userId && page.length) {
    const reads = await prisma.eventRead.findMany({
      where: { userId: opts.userId, eventId: { in: page.map((e) => e.id) } },
      select: { eventId: true },
    });
    readSet = new Set(reads.map((r) => r.eventId));
  }

  const items = page.map((e) => ({
    id: e.id,
    seq: String(e.seq),
    type: e.type,
    stage: e.stage,
    createdAt: e.createdAt.toISOString(),
    rendered: renderEventTemplate(
      { type: e.type, payload: e.payload as Record<string, unknown> | null },
      opts.locale,
    ),
    read: readSet.has(e.id),
  }));

  return { items, nextCursor };
}
