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

  const leads: Lead[] = await Promise.all(
    students.map(async (s) => {
      const last = await prisma.communication.findFirst({ where: { studentId: s.id }, orderBy: { createdAt: "desc" }, select: { createdAt: true } });
      const commCount = await prisma.communication.count({ where: { studentId: s.id } });
      return {
        id: s.id,
        name: s.fullName ?? s.phone,
        source: s.sourceCountry,
        leadScore: s.leadScore,
        createdAt: s.createdAt.toISOString(),
        lastActivityAt: (last?.createdAt ?? s.createdAt).toISOString(),
        isNew: commCount === 0,
      };
    }),
  );

  return <CounsellorInbox leads={leads} />;
}
