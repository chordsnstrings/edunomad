import { createHash } from "node:crypto";
import { authSecret } from "./auth-secret";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { getCurrentSession } from "./current-user";
import type { SessionInfo } from "./sessions";

export function pinHash(pin: string) {
  return createHash("sha256").update(`${pin}:${authSecret()}`).digest("hex");
}

/** How long a parent invite stays acceptable. */
export const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Invites issued before the expiry column existed have no `expiresAt`; they fall
 * back to their send date so an old invite cannot outlive the policy either.
 */
export function isInviteExpired(
  invite: { expiresAt: Date | null; sentAt: Date },
  now = Date.now(),
): boolean {
  const deadline = invite.expiresAt ?? new Date(invite.sentAt.getTime() + INVITE_TTL_MS);
  return deadline.getTime() < now;
}

/** The single student a parent is invited to (most recent accepted invite). */
export async function getParentStudent(parentUserId: string) {
  const invite = await prisma.parentInvite.findFirst({ where: { parentUserId, status: "accepted" }, orderBy: { acceptedAt: "desc" } });
  if (!invite) return null;
  return prisma.student.findUnique({ where: { id: invite.studentId } });
}

export async function requireParent(): Promise<{ session: SessionInfo; student: NonNullable<Awaited<ReturnType<typeof getParentStudent>>> }> {
  const session = await getCurrentSession();
  if (!session || session.role !== "parent") redirect("/parent/login");
  const student = await getParentStudent(session.userId);
  if (!student) redirect("/parent/login");
  return { session, student };
}
