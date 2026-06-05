import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { counsellorStats } from "@/lib/cm-stats";

export const metadata: Metadata = { title: "Scorecard", robots: { index: false } };
export const dynamic = "force-dynamic";

function band(conversion: number, escalations: number): { label: string; tone: string } {
  if (conversion >= 40 && escalations === 0) return { label: "A — Top", tone: "text-green-700" };
  if (conversion >= 25) return { label: "B — Solid", tone: "text-navy" };
  if (conversion >= 12) return { label: "C — Developing", tone: "text-amber-700" };
  return { label: "D — Needs support", tone: "text-red-600" };
}

export default async function ScorecardPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  const { id } = await params;
  const profile = await prisma.counsellorProfile.findUnique({ where: { userId: id } });
  if (!profile) notFound();
  const stats = await counsellorStats(id, new Date(Date.now() - 30 * 24 * 3600 * 1000));
  const b = band(stats.conversion, stats.escalations);

  const tiles: [string, string | number][] = [
    ["Pipeline", stats.pipeline], ["Calls (30d)", stats.calls], ["Locks (30d)", stats.locks],
    ["Conversion", `${stats.conversion}%`], ["Hot leads", stats.hot], ["Escalations", stats.escalations],
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-navy">{profile.fullName}</h1>
      <p className="mb-4 text-sm">Performance band: <span className={`font-semibold ${b.tone}`}>{b.label}</span></p>
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
