import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Refusal analysis", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function RefusalsPage() {
  const refused = await prisma.visaFile.findMany({ where: { decisionStatus: "refused" } });
  const byCountry: Record<string, number> = {};
  const byReason: Record<string, number> = {};
  for (const f of refused) {
    byCountry[f.destinationCountry] = (byCountry[f.destinationCountry] ?? 0) + 1;
    for (const r of (f.refusalReasons as string[] | null) ?? []) {
      const key = r.toLowerCase().slice(0, 40) || "unspecified";
      byReason[key] = (byReason[key] ?? 0) + 1;
    }
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-navy">Visa refusal patterns</h1>
      <p className="mb-5 text-sm text-muted">{refused.length} refusals analysed.</p>
      {refused.length === 0 ? (
        <EmptyState title="No refusals recorded" body="Refusal patterns by destination and reason appear here." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-xl border border-line bg-white p-4">
            <h2 className="mb-2 text-sm font-semibold text-navy">By destination</h2>
            <ul className="space-y-1 text-sm">{Object.entries(byCountry).map(([k, v]) => <li key={k} className="flex justify-between"><span>{k}</span><span className="font-semibold">{v}</span></li>)}</ul>
          </section>
          <section className="rounded-xl border border-line bg-white p-4">
            <h2 className="mb-2 text-sm font-semibold text-navy">By reason</h2>
            <ul className="space-y-1 text-sm">{Object.entries(byReason).sort((a, b) => b[1] - a[1]).map(([k, v]) => <li key={k} className="flex justify-between gap-2"><span className="truncate">{k}</span><span className="font-semibold">{v}</span></li>)}</ul>
          </section>
        </div>
      )}
    </div>
  );
}
