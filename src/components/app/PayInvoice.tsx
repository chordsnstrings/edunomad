"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const METHODS: { id: string; label: string }[] = [
  { id: "bkash", label: "bKash" },
  { id: "nagad", label: "Nagad" },
  { id: "ssl", label: "Card (SSLCommerz)" },
  { id: "card", label: "Card" },
  { id: "bank_transfer", label: "Bank transfer" },
];

export function PayInvoice({ invoiceId, amount, currency, purpose }: { invoiceId: string; amount: number; currency: string; purpose: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function pay(method: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/payments/pay", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invoiceId, method }) });
      if (res.ok) {
        setOpen(false);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">Approve &amp; pay</button>
      {open && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/40 px-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base font-semibold text-navy">Approve payment</h2>
            <p className="mt-1 text-sm text-muted">{purpose} — {amount.toLocaleString()} {currency}</p>
            <p className="mt-3 text-xs font-semibold text-muted">Choose a method</p>
            <div className="mt-2 space-y-2">
              {METHODS.map((m) => (
                <button key={m.id} disabled={busy} onClick={() => pay(m.id)} className="w-full rounded-lg border border-line px-3 py-2.5 text-left text-sm font-medium text-navy hover:bg-subtle disabled:opacity-60">{m.label}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
