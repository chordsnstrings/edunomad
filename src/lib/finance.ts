import { randomUUID } from "node:crypto";
import { prisma } from "./db";
import { countryCurrency, fromUsd, toUsd } from "./currency";

/**
 * W4 finance domain: university commissions + payouts + reconciliation.
 * Amounts normalise to USD for reporting; the source currency is retained.
 */

/** Expected commission for an application, from the institution rate × tuition. */
export async function computeExpectedCommission(applicationId: string) {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { appDocuments: false },
  });
  if (!app) return null;
  const [inst, programme] = await Promise.all([
    prisma.institution.findUnique({ where: { id: app.institutionId } }),
    prisma.programme.findUnique({ where: { id: app.programmeId } }),
  ]);
  if (!inst || !programme) return null;
  const ratePct = inst.commissionRateMinPct; // conservative end of the band
  const commissionUsd = Math.round((programme.tuitionPerYearUsd * ratePct) / 100);
  const currency = countryCurrency(inst.country);
  return {
    applicationId: app.id,
    institutionId: inst.id,
    studentId: app.studentId,
    ratePct,
    currency,
    amount: fromUsd(commissionUsd, currency),
    amountUsd: commissionUsd,
  };
}

/** Create the expected-commission row for an application if it doesn't exist. */
export async function ensureCommission(applicationId: string) {
  const existing = await prisma.commission.findUnique({ where: { applicationId } });
  if (existing) return existing;
  const c = await computeExpectedCommission(applicationId);
  if (!c) return null;
  return prisma.commission.create({
    data: { ...c, status: "expected", expectedAt: new Date() },
  });
}

/** Advance a commission's lifecycle (expected → invoiced → received → reconciled). */
export async function setCommissionStatus(
  id: string,
  status: "expected" | "invoiced" | "received" | "reconciled" | "written_off",
  reference?: string,
) {
  return prisma.commission.update({
    where: { id },
    data: {
      status,
      reference: reference ?? undefined,
      receivedAt: status === "received" ? new Date() : undefined,
    },
  });
}

/** Group received commissions into a settlement payout batch. */
export async function createPayout(commissionIds: string[], approvedByUserId: string) {
  const commissions = await prisma.commission.findMany({
    where: { id: { in: commissionIds }, status: "received", payoutId: null },
  });
  if (commissions.length === 0) return null;
  const amountUsd = commissions.reduce((s, c) => s + c.amountUsd, 0);
  const payout = await prisma.payout.create({
    data: {
      reference: `PO-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`,
      amountUsd,
      currency: "USD",
      status: "scheduled",
      approvedByUserId,
      periodStart: new Date(Math.min(...commissions.map((c) => c.createdAt.getTime()))),
      periodEnd: new Date(),
    },
  });
  await prisma.commission.updateMany({
    where: { id: { in: commissions.map((c) => c.id) } },
    data: { payoutId: payout.id, status: "reconciled" },
  });
  return payout;
}

export async function markPayoutPaid(id: string) {
  return prisma.payout.update({
    where: { id },
    data: { status: "paid", processedAt: new Date() },
  });
}

/** Top-line finance KPIs, all normalised to USD. */
export async function financeSummary() {
  const [payments, invoices, refunds, commissions, payouts] = await Promise.all([
    prisma.payment.findMany({ where: { status: "succeeded" } }),
    prisma.invoice.findMany(),
    prisma.refund.findMany(),
    prisma.commission.findMany(),
    prisma.payout.findMany(),
  ]);
  const inboundUsd = payments.reduce((s, p) => s + toUsd(p.amountLocal, p.currency), 0);
  const sum = (list: { amountUsd: number }[]) => list.reduce((s, c) => s + c.amountUsd, 0);
  return {
    inboundUsd,
    paymentsCount: payments.length,
    invoicesIssued: invoices.filter((i) => i.status === "issued").length,
    invoicesPaid: invoices.filter((i) => i.status === "paid").length,
    refundsPending: refunds.filter((r) => r.stage === "cm_approved").length,
    commissionExpectedUsd: sum(commissions.filter((c) => c.status === "expected" || c.status === "invoiced")),
    commissionReceivedUsd: sum(commissions.filter((c) => c.status === "received" || c.status === "reconciled")),
    payoutsScheduledUsd: payouts.filter((p) => p.status !== "paid").reduce((s, p) => s + p.amountUsd, 0),
    payoutsPaidUsd: payouts.filter((p) => p.status === "paid").reduce((s, p) => s + p.amountUsd, 0),
  };
}
