import type { Metadata } from "next";
import Link from "next/link";
import { requireParent } from "@/lib/parent";
import { prisma } from "@/lib/db";
import { ActivityFeed } from "@/components/app/ActivityFeed";

export const metadata: Metadata = { title: "Parent", robots: { index: false } };
export const dynamic = "force-dynamic";

const STAGES = ["Profile & Eligibility", "Counsellor Onboarding", "Shortlist", "Application Prep", "Application Submitted", "University Decision", "Tuition & GIC", "Visa", "Pre-Departure & Arrival"];

export default async function ParentDashboard() {
  const { student } = await requireParent();
  const counsellor = student.assignedCounsellorId ? await prisma.counsellorProfile.findUnique({ where: { userId: student.assignedCounsellorId } }) : null;
  const events = await prisma.event.findMany({ where: { studentId: student.id }, select: { stage: true }, orderBy: { seq: "desc" }, take: 1 });
  const stage = events[0]?.stage ?? 1;

  return (
    <div>
      <h1 className="text-xl font-semibold text-navy">{student.fullName ?? "Your child"}</h1>
      <p className="text-sm text-muted">Stage {stage} · {STAGES[stage - 1]} · profile {student.completenessPct}%</p>

      {counsellor && (
        <div className="mt-4 rounded-xl border border-line bg-white p-4">
          <p className="text-xs font-semibold text-muted">Counsellor</p>
          <p className="text-sm font-semibold text-navy">{counsellor.fullName}</p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link href="/parent/payments" className="rounded-xl border border-line bg-white p-4 text-sm font-semibold text-navy hover:border-navy">Payments</Link>
        <Link href="/parent/chat" className="rounded-xl border border-line bg-white p-4 text-sm font-semibold text-navy hover:border-navy">Message counsellor</Link>
        <Link href="/parent/faq" className="rounded-xl border border-line bg-white p-4 text-sm font-semibold text-navy hover:border-navy">FAQ</Link>
        <Link href="/parent/settings" className="rounded-xl border border-line bg-white p-4 text-sm font-semibold text-navy hover:border-navy">Settings</Link>
      </div>

      <h2 className="mt-6 mb-3 text-sm font-semibold text-navy">Recent activity</h2>
      <ActivityFeed />
    </div>
  );
}
