import type { Metadata } from "next";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { fmtMoney } from "@/lib/currency";
import { EmptyState } from "@/components/ui/EmptyState";
import { createPayoutAction, markPayoutPaidAction } from "../actions";

export const metadata: Metadata = { title: "Payouts", robots: { index: false } };
export const dynamic = "force-dynamic";

const BADGE: Record<string, string> = {
  scheduled: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  paid: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
};

export default async function PayoutsPage() {
  await requireStaff(["finance"], "/finance/login");
  const [payouts, readyCount] = await Promise.all([
    prisma.payout.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.commission.count({ where: { status: "received", payoutId: null } }),
  ]);
  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-navy">Payouts</h1>
          <p className="text-sm text-muted">
            {readyCount} received commission{readyCount === 1 ? "" : "s"} ready to settle.
          </p>
        </div>
        <form action={createPayoutAction}>
          <button
            disabled={readyCount === 0}
            className="shrink-0 rounded-lg border border-navy px-3 py-2 text-sm font-semibold text-navy hover:bg-subtle disabled:opacity-40"
          >
            Create payout
          </button>
        </form>
      </div>
      {payouts.length === 0 ? (
        <EmptyState title="No payouts yet" body="Settle received commissions into a payout batch." />
      ) : (
        <ul className="space-y-2">
          {payouts.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-3.5">
              <div className="min-w-0">
                <p className="truncate font-mono text-sm font-semibold text-navy">{p.reference}</p>
                <p className="text-xs text-muted">{new Date(p.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <p className="text-sm font-semibold text-navy">{fmtMoney(p.amountUsd)}</p>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${BADGE[p.status] ?? "bg-subtle text-muted"}`}>
                  {p.status}
                </span>
                {p.status !== "paid" && (
                  <form action={markPayoutPaidAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
                      Mark paid
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
