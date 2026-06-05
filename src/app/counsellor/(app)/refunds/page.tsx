import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { requestRefundAction, approveRefundAction } from "./actions";

export const metadata: Metadata = { title: "Refunds", robots: { index: false } };
export const dynamic = "force-dynamic";

const STAGE_LABEL: Record<string, string> = { requested: "Requested", cm_approved: "CM approved", finance_approved: "Finance approved", paid: "Paid", rejected: "Rejected" };

export default async function RefundsPage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  const refunds = await prisma.refund.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">Refund approvals</h1>
      <p className="mb-4 text-sm text-muted">Multi-stage: requested → CM approved → finance approved.</p>

      <form action={requestRefundAction} className="mb-5 space-y-2 rounded-xl border border-line bg-white p-4">
        <p className="text-sm font-semibold text-navy">Raise a refund request</p>
        <input name="studentId" placeholder="Student ID" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
        <input name="amount" inputMode="numeric" placeholder="Amount (BDT)" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
        <input name="reason" placeholder="Reason" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
        <button className="rounded-lg border border-navy px-4 py-2 text-sm font-semibold text-navy hover:bg-subtle">Submit request</button>
      </form>

      <ul className="space-y-2">
        {refunds.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-3.5 text-sm">
            <div>
              <p className="font-semibold text-navy">{r.amountLocal.toLocaleString()} {r.currency}</p>
              <p className="text-xs text-muted">{r.reason} · {STAGE_LABEL[r.stage] ?? r.stage}</p>
            </div>
            {r.stage === "requested" && (
              <form action={approveRefundAction}>
                <input type="hidden" name="id" value={r.id} />
                <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">Approve</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
