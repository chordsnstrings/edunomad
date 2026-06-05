import type { Metadata } from "next";
import { requireStaff } from "@/lib/require-staff";
import { counsellorStats } from "@/lib/cm-stats";

export const metadata: Metadata = { title: "My stats", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function MyStatsPage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  const stats = await counsellorStats(session.userId, new Date(Date.now() - 30 * 24 * 3600 * 1000));
  const tiles: [string, string | number][] = [
    ["My pipeline", stats.pipeline], ["Calls (30d)", stats.calls], ["Shortlist locks", stats.locks],
    ["Conversion", `${stats.conversion}%`], ["Hot leads", stats.hot], ["Escalations", stats.escalations],
  ];
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-navy">My stats</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tiles.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-line bg-white p-4">
            <p className="text-xs text-muted">{k}</p>
            <p className="text-lg font-semibold text-navy">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
