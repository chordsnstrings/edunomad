import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const RETENTION_YEARS = 6;

// Retention enforcement (G173). Events + audit are append-only (never deleted);
// records beyond the 6-year window are flagged for cold-storage archival.
// An external scheduler invokes this; secured by CRON_SECRET.
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("x-cron-secret") !== secret) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const cutoff = new Date(Date.now() - RETENTION_YEARS * 365 * 24 * 3600 * 1000);
  const [events, audit, archivedStudents] = await Promise.all([
    prisma.event.count({ where: { createdAt: { lt: cutoff } } }),
    prisma.auditLog.count({ where: { createdAt: { lt: cutoff } } }),
    prisma.user.count({ where: { archivedAt: { not: null } } }),
  ]);
  return Response.json({ ok: true, retentionYears: RETENTION_YEARS, beyondRetention: { events, audit }, archivedUsers: archivedStudents, policy: "append-only; archived to cold storage beyond retention" });
}
