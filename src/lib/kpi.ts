import { prisma } from "./db";

/**
 * Education-Manager KPIs (§6 kpi_dashboard): the journey funnel + top-line
 * counts, derived from the event stream and core entities.
 */

const FUNNEL: { label: string; type: string | null }[] = [
  { label: "Students", type: null },
  { label: "Eligibility checked", type: "eligibility.checked" },
  { label: "Shortlist locked", type: "shortlist.locked" },
  { label: "Applications submitted", type: "application.submitted" },
  { label: "Offers received", type: "offer.received" },
  { label: "Visa signed off", type: "visa.signed_off" },
  { label: "Visa approved", type: "visa.approved" },
];

export async function journeyFunnel() {
  // One distinct scan for the whole funnel instead of a sequential unbounded scan
  // per step (six round-trips over the largest table, counted in JavaScript).
  const types = FUNNEL.map((s) => s.type).filter((t): t is string => !!t);
  const [totalStudents, pairs] = await Promise.all([
    prisma.student.count(),
    prisma.event.findMany({
      where: { type: { in: types }, studentId: { not: null } },
      select: { type: true, studentId: true },
      distinct: ["type", "studentId"],
    }),
  ]);

  const reachedByType = new Map<string, number>();
  for (const p of pairs) reachedByType.set(p.type, (reachedByType.get(p.type) ?? 0) + 1);

  const rows = FUNNEL.map((step) => ({
    label: step.label,
    count: step.type ? (reachedByType.get(step.type) ?? 0) : totalStudents,
  }));
  return rows;
}

export async function overviewStats() {
  const [students, applications, offers, visaFiles, approved, counsellors, ops] =
    await Promise.all([
      prisma.student.count(),
      prisma.application.count(),
      prisma.application.count({
        where: { submissionStatus: { in: ["offer_unconditional", "offer_conditional"] } },
      }),
      prisma.visaFile.count(),
      prisma.visaFile.count({ where: { decisionStatus: "approved" } }),
      prisma.user.count({
        where: { role: { in: ["counsellor", "counsellor_manager"] }, status: "active" },
      }),
      prisma.user.count({
        where: { role: { in: ["operations_team", "operations_manager"] }, status: "active" },
      }),
    ]);
  return { students, applications, offers, visaFiles, approved, counsellors, ops };
}
