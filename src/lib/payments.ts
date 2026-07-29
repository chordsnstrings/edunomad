import { prisma } from "./db";
import { emit, withEvents } from "./events";
import { AUDIENCE } from "./event-visibility";

export const PAYMENT_METHODS = ["bkash", "nagad", "ssl", "card", "bank_transfer"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** Mock payment gateway. Real bKash / Nagad / SSLCommerz / card / bank
 *  integrations plug in behind this single function (no off-platform flows). */
export async function processGateway(method: string, _amountLocal: number): Promise<{ ok: boolean; ref: string }> {
  if (!(PAYMENT_METHODS as readonly string[]).includes(method)) return { ok: false, ref: "" };
  return { ok: true, ref: `${method.toUpperCase()}-${Date.now().toString(36)}` };
}

export async function payInvoice(invoiceId: string, method: string, actorUserId: string) {
  // Reject an unknown method before claiming anything: Payment.method is a
  // Postgres enum, so an invalid value throws at insert — which, after the claim
  // below, would strand the invoice marked paid with no payment recorded.
  if (!(PAYMENT_METHODS as readonly string[]).includes(method)) {
    return { ok: false as const, error: "failed" };
  }

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
  if (!gw.ok) {
    await prisma.payment.create({
      data: { invoiceId, amountLocal: invoice.amountLocal, currency: invoice.currency, method: method as PaymentMethod, externalRef: gw.ref, status: "failed", approvedByUserId: actorUserId, processedAt: new Date() },
    });
    // Release the claim so the student can retry with another method.
    await prisma.invoice.update({ where: { id: invoiceId }, data: { status: invoice.status } });
    return { ok: false as const, error: "failed" } as const;
  }

  // Payment row and its event commit together: a crash between them would take
  // the student's money with nothing in the log (and no notification).
  await withEvents(async (tx) => {
    await tx.payment.create({
      data: { invoiceId, amountLocal: invoice.amountLocal, currency: invoice.currency, method: method as PaymentMethod, externalRef: gw.ref, status: "succeeded", approvedByUserId: actorUserId, processedAt: new Date() },
    });
    await emit({
      type: "payment.received",
      stage: 7,
      studentId: invoice.studentId,
      actorType: "parent",
      actorId: actorUserId,
      visibility: AUDIENCE.money,
      channels: { in_app: true, push: true, whatsapp: true, email: true },
      payload: { amount: invoice.amountLocal, currency: invoice.currency, method, purpose: invoice.purpose },
    }, tx);
  });
  return { ok: gw.ok, error: gw.ok ? undefined : "failed" } as const;
}
