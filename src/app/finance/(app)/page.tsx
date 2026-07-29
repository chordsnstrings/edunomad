import type { Metadata } from "next";
import Link from "next/link";
import { requireStaff } from "@/lib/require-staff";
import { financeSummary } from "@/lib/finance";
import { fmtMoney } from "@/lib/currency";

export const metadata: Metadata = { title: "Finance overview", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function FinanceOverview() {
  await requireStaff(["finance"], "/finance/login");
  const s = await financeSummary();
  const cards = [
    { label: "Inbound (succeeded)", value: fmtMoney(s.inboundUsd), sub: `${s.paymentsCount} payments` },
    { label: "Invoices", value: `${s.invoicesPaid} paid`, sub: `${s.invoicesIssued} outstanding` },
    { label: "Commission expected", value: fmtMoney(s.commissionExpectedUsd), sub: "offered applications" },
    { label: "Commission received", value: fmtMoney(s.commissionReceivedUsd), sub: "reconciled to date" },
    { label: "Payouts scheduled", value: fmtMoney(s.payoutsScheduledUsd), sub: "awaiting settlement" },
    { label: "Refunds to action", value: String(s.refundsPending), sub: "awaiting finance" },
  ];
  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">Finance overview</h1>
      <p className="mb-5 text-sm text-muted">All figures normalised to USD.</p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-line bg-white p-4">
            <p className="text-xs font-medium text-muted">{c.label}</p>
            <p className="mt-1 text-xl font-semibold text-navy">{c.value}</p>
            <p className="mt-0.5 text-xs text-muted">{c.sub}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/finance/commissions" className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-subtle tap">Manage commissions</Link>
        <Link href="/finance/payouts" className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-subtle tap">Process payouts</Link>
        <Link href="/finance/refunds" className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-subtle tap">Approve refunds</Link>
      </div>
    </div>
  );
}
