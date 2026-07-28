import { prisma } from "./db";
import { emit } from "./events";

export const PAYMENT_METHODS = ["bkash", "nagad", "ssl", "card", "bank_transfer"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** Mock payment gateway. Real bKash / Nagad / SSLCommerz / card / bank
 *  integrations plug in behind this single function (no off-platform flows). */
export async function processGateway(method: string, _amountLocal: number): Promise<{ ok: boolean; ref: string }> {
  if (!(PAYMENT_METHODS as readonly string[]).includes(method)) return { ok: false, ref: "" };
  return { ok: true, ref: `${method.toUpperCase()}-${Date.now().toString(36)}` };
}

export async function payInvoice(invoiceId: string, method: string, actorUserId: string) {
  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice || invoice.status === "paid") return { ok: false as const, error: "unavailable" };

  // Claim the invoice BEFORE charging. The old read-then-write left a window in
  // which two concurrent submissions both saw an unpaid invoice, both charged the
  // gateway and both recorded a succeeded Payment — a genuine double-charge on a
  // double-tap. The conditional update is atomic in Postgres, so exactly one
  // caller can win; the loser stops here without touching the gateway.
  const claimed = await prisma.invoice.updateMany({
    where: { id: invoiceId, status: { not: "paid" } },
    data: { status: "paid" },
  });
  if (claimed.count !== 1) return { ok: false as const, error: "unavailable" };

  const gw = await processGateway(method, invoice.amountLocal);
  await prisma.payment.create({
    data: { invoiceId, amountLocal: invoice.amountLocal, currency: invoice.currency, method: method as PaymentMethod, externalRef: gw.ref, status: gw.ok ? "succeeded" : "failed", approvedByUserId: actorUserId, processedAt: new Date() },
  });
  if (!gw.ok) {
    // Release the claim so the student can retry with another method.
    await prisma.invoice.update({ where: { id: invoiceId }, data: { status: invoice.status } });
  }
  if (gw.ok) {
    await emit({
      type: "payment.received",
      stage: 7,
      studentId: invoice.studentId,
      actorType: "parent",
      actorId: actorUserId,
      visibility: { S: true, P: true, C: true, F: true },
      channels: { in_app: true, push: true, whatsapp: true, email: true },
      payload: { amount: invoice.amountLocal, currency: invoice.currency, method, purpose: invoice.purpose },
    });
  }
  return { ok: gw.ok, error: gw.ok ? undefined : "failed" } as const;
}
