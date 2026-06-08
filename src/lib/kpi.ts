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
  const totalStudents = await prisma.student.count();
  const rows: { label: string; count: number }[] = [];
  for (const step of FUNNEL) {
    if (!step.type) {
      rows.push({ label: step.label, count: totalStudents });
      continue;
    }
    const distinctStudents = await prisma.event.findMany({
      where: { type: step.type, studentId: { not: null } },
      select: { studentId: true },
      distinct: ["studentId"],
    });
    rows.push({ label: step.label, count: distinctStudents.length });
  }
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
