import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireParent } from "@/lib/parent";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/EmptyState";
import { PayInvoice } from "@/components/app/PayInvoice";

export const metadata: Metadata = { title: "Payments", robots: { index: false } };
export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = { issued: "Due", paid: "Paid", partially_paid: "Partial", void: "Void", refunded: "Refunded" };

export default async function ParentPayments() {
  const { student } = await requireParent();
  const invoices = await prisma.invoice.findMany({ where: { studentId: student.id }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <Link href="/parent" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">Payments</h1>
      <p className="mb-4 text-sm text-muted">All payments go through EduNomad — never pay anyone directly.</p>
      {invoices.length === 0 ? (
        <EmptyState title="No invoices yet" body="When a payment is due, it will appear here for your approval." />
      ) : (
        <ul className="space-y-3">
          {invoices.map((inv) => (
            <li key={inv.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-4">
              <div>
                <p className="text-sm font-semibold text-navy">{inv.purpose}</p>
                <p className="text-sm text-ink">{inv.amountLocal.toLocaleString()} {inv.currency} <span className="text-xs text-muted">· {STATUS[inv.status]}</span></p>
              </div>
              {inv.status === "issued" && <PayInvoice invoiceId={inv.id} amount={inv.amountLocal} currency={inv.currency} purpose={inv.purpose} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
