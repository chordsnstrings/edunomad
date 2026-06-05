import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { requireStaff } from "@/lib/require-staff";
import { counsellorStats, managedCounsellors } from "@/lib/cm-stats";
import { AutoRefresh } from "@/components/counsellor/AutoRefresh";

export const metadata: Metadata = { title: "Standup", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function StandupPage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  const since = new Date(Date.now() - 24 * 3600 * 1000);
  const team = await managedCounsellors(session.userId);
  const rows = await Promise.all(team.map(async (c) => ({ id: c.userId, name: c.fullName, ...(await counsellorStats(c.userId, since)) })));
  const totals = rows.reduce((a, r) => ({ newAssigned: a.newAssigned + r.newAssigned, calls: a.calls + r.calls, locks: a.locks + r.locks, escalations: a.escalations + r.escalations }), { newAssigned: 0, calls: 0, locks: 0, escalations: 0 });

  return (
    <div>
      <AutoRefresh />
      <h1 className="mb-1 text-xl font-semibold text-navy">Standup — last 24 hours</h1>
      <p className="mb-4 text-sm text-muted">{totals.newAssigned} new leads · {totals.calls} calls · {totals.locks} locks · {totals.escalations} escalations</p>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-line text-left text-xs text-muted"><th className="p-3">Counsellor</th><th className="p-3">New</th><th className="p-3">Calls</th><th className="p-3">Locks</th><th className="p-3">Esc.</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-line/60 last:border-0">
                <td className="p-3"><Link href={`/counsellor/scorecard/${r.id}`} className="font-medium text-navy underline">{r.name}</Link></td>
                <td className="p-3">{r.newAssigned}</td><td className="p-3">{r.calls}</td><td className="p-3">{r.locks}</td>
                <td className={`p-3 ${r.escalations > 0 ? "font-semibold text-red-600" : ""}`}>{r.escalations}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
