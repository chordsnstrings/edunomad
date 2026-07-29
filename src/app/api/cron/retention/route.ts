import type { NextRequest } from "next/server";
import { verifySharedSecret } from "@/lib/shared-secret";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const RETENTION_YEARS = 6;
/** Compliance hold before a deactivated user is archived (CLAUDE.md §4). */
const ARCHIVE_HOLD_DAYS = 90;

// Retention enforcement (G173). Events + audit are append-only (never deleted);
// records beyond the 6-year window are flagged for cold-storage archival.
// An external scheduler invokes this; secured by CRON_SECRET.
export async function POST(req: NextRequest) {
  const denied = verifySharedSecret(req, "CRON_SECRET", "x-cron-secret");
  if (denied) return denied;
  const cutoff = new Date(Date.now() - RETENTION_YEARS * 365 * 24 * 3600 * 1000);
  // CLAUDE.md §4: users are soft-deleted (deactivated), held 90 days, then
  // archived. Nothing ever wrote archivedAt, so the hold never ended and the
  // "archived" UserStatus was unreachable — this endpoint only counted rows.
  const holdEnds = new Date(Date.now() - ARCHIVE_HOLD_DAYS * 24 * 3600 * 1000);
  const archived = await prisma.user.updateMany({
    where: { status: "deactivated", deactivatedAt: { lt: holdEnds }, archivedAt: null },
    data: { status: "archived", archivedAt: new Date() },
  });

  const [events, audit, archivedTotal] = await Promise.all([
    prisma.event.count({ where: { createdAt: { lt: cutoff } } }),
    prisma.auditLog.count({ where: { createdAt: { lt: cutoff } } }),
    prisma.user.count({ where: { archivedAt: { not: null } } }),
  ]);
  return Response.json({
    ok: true,
    retentionYears: RETENTION_YEARS,
    beyondRetention: { events, audit },
    archivedThisRun: archived.count,
    archivedUsers: archivedTotal,
    policy: "append-only; users archived after a 90-day hold; records beyond retention go to cold storage",
  });
}
