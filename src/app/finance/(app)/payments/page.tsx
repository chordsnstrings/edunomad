import type { Metadata } from "next";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { fmtMoney, toUsd } from "@/lib/currency";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Payments", robots: { index: false } };
export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  succeeded: "bg-green-50 text-green-700",
  initiated: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-700",
  refunded: "bg-subtle text-muted",
};

export default async function PaymentsPage() {
  await requireStaff(["finance"], "/finance/login");
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { invoice: true },
  });
  const studentIds = [...new Set(payments.map((p) => p.invoice.studentId))];
  const students = await prisma.student.findMany({
    where: { id: { in: studentIds } },
    select: { id: true, fullName: true },
  });
  const nameOf = (id: string) => students.find((s) => s.id === id)?.fullName ?? "Student";

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">Inbound payments</h1>
      <p className="mb-4 text-sm text-muted">
        Reconciliation view — platform gateways only. Amounts shown in source currency and USD.
      </p>
      {payments.length === 0 ? (
        <EmptyState title="No payments yet" body="Student and parent payments will appear here as they settle." />
      ) : (
        <ul className="space-y-2">
          {payments.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-navy">
                  {nameOf(p.invoice.studentId)} · {p.invoice.purpose.replace(/_/g, " ")}
                </p>
                <p className="text-xs text-muted">
                  {p.method} · {new Date(p.createdAt).toLocaleDateString()}
                  {p.externalRef ? ` · ${p.externalRef}` : ""}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-navy">
                  {fmtMoney(p.amountLocal, p.currency)}
                </p>
                <p className="text-xs text-muted">≈ {fmtMoney(toUsd(p.amountLocal, p.currency))}</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLE[p.status] ?? "bg-subtle text-muted"}`}>
                  {p.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
