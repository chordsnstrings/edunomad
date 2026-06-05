import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { requireStaff } from "@/lib/require-staff";
import { counsellorStats, managedCounsellors, performanceTier } from "@/lib/cm-stats";

export const metadata: Metadata = { title: "Performance tiers", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function TiersPage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  const team = await managedCounsellors(session.userId);
  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  const rows = await Promise.all(team.map(async (c) => {
    const stats = await counsellorStats(c.userId, since);
    return { id: c.userId, name: c.fullName, stats, tier: performanceTier(stats) };
  }));
  rows.sort((a, b) => b.stats.conversion - a.stats.conversion);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-navy">Performance tiers</h1>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center justify-between rounded-xl border border-line bg-white p-3.5 text-sm">
            <Link href={`/counsellor/scorecard/${r.id}`} className="font-medium text-navy underline">{r.name}</Link>
            <span className="text-xs text-muted">{r.stats.conversion}% conv · {r.stats.escalations} esc.</span>
            <span className={`text-sm font-semibold ${r.tier.tone}`}>{r.tier.tier}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
