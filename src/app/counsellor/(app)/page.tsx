import type { Metadata } from "next";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { CounsellorInbox, type Lead } from "@/components/counsellor/CounsellorInbox";

export const metadata: Metadata = { title: "Inbox", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  const where =
    session.role === "counsellor"
      ? { assignedCounsellorId: session.userId }
      : { assignedCounsellorId: { not: null } };

  const students = await prisma.student.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });

  // One grouped aggregate for the whole page instead of 2 queries per student
  // (200 students used to mean 400 round-trips).
  const commStats = await prisma.communication.groupBy({
    by: ["studentId"],
    where: { studentId: { in: students.map((s) => s.id) } },
    _max: { createdAt: true },
    _count: { _all: true },
  });
  const statsBy = new Map(commStats.map((c) => [c.studentId, c]));

  const leads: Lead[] = students.map((s) => {
    const stat = statsBy.get(s.id);
    return {
      id: s.id,
      name: s.fullName ?? s.phone,
      source: s.sourceCountry,
      leadScore: s.leadScore,
      createdAt: s.createdAt.toISOString(),
      lastActivityAt: (stat?._max.createdAt ?? s.createdAt).toISOString(),
      isNew: (stat?._count._all ?? 0) === 0,
    };
  });

  return <CounsellorInbox leads={leads} />;
}
