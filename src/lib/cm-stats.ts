import { prisma } from "./db";

export type CounsellorStats = {
  pipeline: number;
  newAssigned: number;
  calls: number;
  locks: number;
  escalations: number;
  hot: number;
  conversion: number;
};

/** Aggregate a counsellor's activity since `since` (CM dashboards). */
export async function counsellorStats(userId: string, since: Date): Promise<CounsellorStats> {
  const students = await prisma.student.findMany({ where: { assignedCounsellorId: userId }, select: { id: true, createdAt: true } });
  const ids = students.map((s) => s.id);
  if (ids.length === 0) return { pipeline: 0, newAssigned: 0, calls: 0, locks: 0, escalations: 0, hot: 0, conversion: 0 };

  const [calls, locks, escalations] = await Promise.all([
    prisma.communication.count({ where: { studentId: { in: ids }, type: "call", createdAt: { gte: since } } }),
    prisma.event.count({ where: { type: "shortlist.locked", studentId: { in: ids }, createdAt: { gte: since } } }),
    prisma.event.count({ where: { type: "escalation.raised", studentId: { in: ids }, createdAt: { gte: since } } }),
  ]);

  let hot = 0;
  for (const s of students) {
    const lc = await prisma.communication.findFirst({ where: { studentId: s.id, type: "call" }, orderBy: { createdAt: "desc" }, select: { metadata: true } });
    if ((lc?.metadata as { outcomeTag?: string } | null)?.outcomeTag === "hot") hot++;
  }
  const totalLocks = await prisma.event.count({ where: { type: "shortlist.locked", studentId: { in: ids } } });

  return {
    pipeline: students.length,
    newAssigned: students.filter((s) => s.createdAt >= since).length,
    calls,
    locks,
    escalations,
    hot,
    conversion: students.length ? Math.round((totalLocks / students.length) * 100) : 0,
  };
}

export async function managedCounsellors(managerUserId: string) {
  return prisma.counsellorProfile.findMany({ where: { managerId: managerUserId, active: true } });
}
