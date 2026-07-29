import type { Metadata } from "next";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { fmtMoney } from "@/lib/currency";
import { EmptyState } from "@/components/ui/EmptyState";
import { financeApproveRefundAction, payRefundAction } from "../actions";

export const metadata: Metadata = { title: "Refunds", robots: { index: false } };
export const dynamic = "force-dynamic";

const STAGE: Record<string, { label: string; style: string }> = {
  requested: { label: "Awaiting CM", style: "bg-subtle text-muted" },
  cm_approved: { label: "CM approved", style: "bg-amber-50 text-amber-700" },
  finance_approved: { label: "Finance approved", style: "bg-blue-50 text-blue-700" },
  paid: { label: "Paid", style: "bg-green-50 text-green-700" },
  rejected: { label: "Rejected", style: "bg-red-50 text-red-700" },
};

export default async function FinanceRefundsPage() {
  await requireStaff(["finance"], "/finance/login");
  const refunds = await prisma.refund.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">Refund approvals</h1>
      <p className="mb-4 text-sm text-muted">
        Finance leg of the chain: CM&nbsp;approved → finance&nbsp;approved → paid.
      </p>
      {refunds.length === 0 ? (
        <EmptyState title="No refund requests" body="Refund requests raised by counsellor managers will appear here." />
      ) : (
        <ul className="space-y-2">
          {refunds.map((r) => {
            const st = STAGE[r.stage] ?? { label: r.stage, style: "bg-subtle text-muted" };
            return (
              <li key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy">{fmtMoney(r.amountLocal, r.currency)}</p>
                  <p className="truncate text-xs text-muted">{r.reason}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${st.style}`}>{st.label}</span>
                  {r.stage === "cm_approved" && (
                    <form action={financeApproveRefundAction}>
                      <input type="hidden" name="id" value={r.id} />
                      <SubmitButton className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-700" pendingLabel="Working…">Approve</SubmitButton>
                    </form>
                  )}
                  {r.stage === "finance_approved" && (
                    <form action={payRefundAction}>
                      <input type="hidden" name="id" value={r.id} />
                      <SubmitButton className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700" pendingLabel="Working…">Mark paid</SubmitButton>
                    </form>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
