import { prisma } from "./db";
import { logAudit } from "./audit";

/**
 * Soft-delete a user (CLAUDE.md §4: users are deactivated, held 90 days, then
 * archived — never hard-deleted).
 *
 * The schema carried deactivatedAt/archivedAt and an "archived" status that no
 * code ever wrote, so the documented lifecycle did not exist. The retention cron
 * completes it by archiving once the hold expires.
 */
export async function deactivateUser(userId: string, actorUserId: string, reason?: string) {
  const updated = await prisma.user.updateMany({
    where: { id: userId, status: "active" },
    data: { status: "deactivated", deactivatedAt: new Date() },
  });
  if (updated.count === 1) {
    // Revoke live sessions so the deactivation takes effect immediately.
    await prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await logAudit({
      actorUserId,
      action: "user.delete",
      targetType: "User",
      targetId: userId,
      result: "success",
      reason: reason ?? "deactivated (90-day hold before archival)",
    });
  }
  return updated.count === 1;
}
