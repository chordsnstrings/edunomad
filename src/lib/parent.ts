import { createHash } from "node:crypto";
import { authSecret } from "./auth-secret";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { getCurrentSession } from "./current-user";
import type { SessionInfo } from "./sessions";

export function pinHash(pin: string) {
  return createHash("sha256").update(`${pin}:${authSecret()}`).digest("hex");
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
