import type { Metadata } from "next";
import { requireStaff } from "@/lib/require-staff";
import { journeyFunnel, overviewStats } from "@/lib/kpi";
import { financeSummary } from "@/lib/finance";
import { fmtMoney } from "@/lib/currency";

export const metadata: Metadata = { title: "KPIs", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EducationKpis() {
  await requireStaff(["education_manager"], "/education/login");
  const [funnel, stats, fin] = await Promise.all([
    journeyFunnel(),
    overviewStats(),
    financeSummary(),
  ]);
  const max = Math.max(1, ...funnel.map((f) => f.count));
  const cards = [
    { label: "Students", value: stats.students },
    { label: "Applications", value: stats.applications },
    { label: "Offers", value: stats.offers },
    { label: "Visas approved", value: stats.approved },
    { label: "Counsellors", value: stats.counsellors },
    { label: "Operations", value: stats.ops },
  ];
  const money = [
    { label: "Inbound (USD)", value: fmtMoney(fin.inboundUsd) },
    { label: "Commission received", value: fmtMoney(fin.commissionReceivedUsd) },
    { label: "Commission expected", value: fmtMoney(fin.commissionExpectedUsd) },
  ];
  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">Vertical KPIs</h1>
      <p className="mb-5 text-sm text-muted">BD&nbsp;→&nbsp;Canada · P&amp;L and journey oversight.</p>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-line bg-white p-3 text-center">
            <p className="text-lg font-semibold text-navy">{c.value}</p>
            <p className="text-[11px] leading-tight text-muted">{c.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-7 text-sm font-semibold text-navy">Journey funnel</h2>
      <div className="space-y-2.5 rounded-2xl border border-line bg-white p-4">
        {funnel.map((f) => (
          <div key={f.label} className="flex items-center gap-3">
            <span className="w-32 shrink-0 text-xs text-muted sm:w-44">{f.label}</span>
            <span className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-subtle">
              <span
                className="block h-full rounded-full bg-gold"
                style={{ width: `${(f.count / max) * 100}%` }}
              />
            </span>
            <span className="w-8 shrink-0 text-right text-sm font-semibold text-navy">{f.count}</span>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-7 text-sm font-semibold text-navy">Financial summary</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {money.map((m) => (
          <div key={m.label} className="rounded-xl border border-line bg-white p-3.5">
            <p className="text-base font-semibold text-navy">{m.value}</p>
            <p className="text-xs text-muted">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
