import { prisma } from "./db";
import { emit } from "./events";

export type Candidate = {
  userId: string;
  languages: string[];
  destinations: string[];
  capacity: number;
  currentLoad: number;
  tenureStartedAt: Date;
};
export type RoutingStudent = {
  language?: string | null;
  destinations?: string[] | null;
  leadScore?: number | null;
};

export function normalizedTenure(start: Date, now = Date.now()): number {
  const years = (now - +new Date(start)) / (365 * 24 * 3600 * 1000);
  return Math.max(0, Math.min(1, years / 3));
}

/** Score = language 40% × destination 25% × load 20% × lead-fit 15%. */
export function scoreCounsellor(student: RoutingStudent, c: Candidate, now = Date.now()): number {
  const lang = student.language && c.languages.includes(student.language) ? 1 : 0;
  const dests = student.destinations ?? [];
  const dest = dests.length
    ? dests.filter((d) => c.destinations.includes(d)).length / dests.length
    : c.destinations.length
      ? 0.5
      : 0;
  const load = c.capacity > 0 ? Math.max(0, Math.min(1, 1 - c.currentLoad / c.capacity)) : 0;
  const leadFit = ((student.leadScore ?? 50) / 100) * normalizedTenure(c.tenureStartedAt, now);
  return 0.4 * lang + 0.25 * dest + 0.2 * load + 0.15 * leadFit;
}

/** Best counsellor or null. Excludes >130% capacity; ties broken by tenure (senior wins). */
export function routeStudent(student: RoutingStudent, candidates: Candidate[], now = Date.now()): Candidate | null {
  const eligible = candidates.filter((c) => c.currentLoad <= 1.3 * c.capacity);
  let best: Candidate | null = null;
  let bestScore = -1;
  for (const c of eligible) {
    const s = scoreCounsellor(student, c, now);
    if (s > bestScore || (s === bestScore && best && +new Date(c.tenureStartedAt) < +new Date(best.tenureStartedAt))) {
      best = c;
      bestScore = s;
    }
  }
  return best;
}

/** Auto-assign a counsellor for a student, emitting the appropriate event. */
export async function assignCounsellor(studentId: string): Promise<{ counsellorUserId: string | null }> {
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return { counsellorUserId: null };

  const profiles = await prisma.counsellorProfile.findMany({ where: { active: true } });
  const candidates: Candidate[] = await Promise.all(
    profiles.map(async (p) => ({
      userId: p.userId,
      languages: p.languages,
      destinations: p.destinations,
      capacity: p.capacity,
      currentLoad: await prisma.student.count({ where: { assignedCounsellorId: p.userId } }),
      tenureStartedAt: p.tenureStartedAt,
    })),
  );

  const best = routeStudent(
    { language: student.language, destinations: student.destinations as string[] | null, leadScore: student.leadScore },
    candidates,
  );

  if (!best) {
    await emit({
      type: "lead.routed_to_manager",
      stage: 2,
      studentId,
      actorType: "system",
      visibility: { CM: true },
      channels: { in_app: true },
      payload: { reason: "no_eligible_counsellor" },
    });
    return { counsellorUserId: null };
  }

  await prisma.student.update({ where: { id: studentId }, data: { assignedCounsellorId: best.userId } });
  await emit({
    type: "counsellor.assigned",
    stage: 2,
    studentId,
    actorType: "system",
    visibility: { S: true, C: true, CM: true },
    channels: { in_app: true, push: true },
    payload: { counsellorUserId: best.userId },
  });
  return { counsellorUserId: best.userId };
}
