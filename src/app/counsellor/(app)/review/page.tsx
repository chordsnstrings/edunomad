import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";
import { counsellorStats, managedCounsellors } from "@/lib/cm-stats";

export const metadata: Metadata = { title: "Monthly review", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  const team = await managedCounsellors(session.userId);
  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  const rows = await Promise.all(team.map(async (c) => ({ name: c.fullName, ...(await counsellorStats(c.userId, since)) })));
  const totals = rows.reduce((a, r) => ({ pipeline: a.pipeline + r.pipeline, locks: a.locks + r.locks, escalations: a.escalations + r.escalations }), { pipeline: 0, locks: 0, escalations: 0 });
  const avgConv = rows.length ? Math.round(rows.reduce((a, r) => a + r.conversion, 0) / rows.length) : 0;

  return (
    <div className="prose-sm max-w-none">
      <h1 className="text-xl font-semibold text-navy">CM → EM monthly business review</h1>
      <p className="text-sm text-muted">Auto-generated from the last 30 days. Edit before sending.</p>
      <div className="mt-4 space-y-3 rounded-xl border border-line bg-white p-4 text-sm leading-relaxed text-ink">
        <p><strong>Team size:</strong> {rows.length} counsellors</p>
        <p><strong>Total pipeline:</strong> {totals.pipeline} students</p>
        <p><strong>Shortlist locks (30d):</strong> {totals.locks}</p>
        <p><strong>Average conversion:</strong> {avgConv}%</p>
        <p><strong>Escalations (30d):</strong> {totals.escalations}</p>
        <p><strong>Top performers:</strong> {[...rows].sort((a, b) => b.conversion - a.conversion).slice(0, 3).map((r) => r.name).join(", ") || "—"}</p>
        <p><strong>Risks / asks:</strong> ____________________</p>
        <p><strong>Next-month plan:</strong> ____________________</p>
      </div>
    </div>
  );
}
