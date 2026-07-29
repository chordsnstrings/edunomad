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
  // Select, create and claim atomically. Read-then-write across three separate
  // round-trips let two concurrent "Create payout" clicks both see the same
  // unclaimed commissions and each mint a full-value Payout for them.
  return prisma.$transaction(async (tx) => {
    const commissions = await tx.commission.findMany({
      where: { id: { in: commissionIds }, status: "received", payoutId: null },
    });
    if (commissions.length === 0) return null;
    const amountUsd = commissions.reduce((s, c) => s + c.amountUsd, 0);
    const payout = await tx.payout.create({
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
    // payoutId: null in the predicate so a commission claimed by a concurrent
    // batch is not re-claimed here.
    const claimed = await tx.commission.updateMany({
      where: { id: { in: commissions.map((c) => c.id) }, payoutId: null },
      data: { payoutId: payout.id, status: "reconciled" },
    });
    if (claimed.count === 0) throw new Error("commissions already claimed by another payout");
    return payout;
  });
}

/** Idempotent: paying an already-paid payout is a no-op rather than a re-stamp. */
export async function markPayoutPaid(id: string) {
  return prisma.payout.updateMany({
    where: { id, status: { not: "paid" } },
    data: { status: "paid", processedAt: new Date() },
  });
}

/**
 * Top-line finance KPIs, all normalised to USD.
 *
 * Aggregated in Postgres. This used to load the entire Payment, Invoice, Refund,
 * Commission and Payout tables into Node to compute nine scalars — cost grew with
 * every transaction the business ever processed, on a dashboard.
 */
export async function financeSummary() {
  const [byCurrency, invoiceCounts, refundsPending, commissionSums, payoutSums] = await Promise.all([
    // Payments are stored in their local currency, so sum per currency and
    // convert the (few) group totals rather than every row.
    prisma.payment.groupBy({
      by: ["currency"],
      where: { status: "succeeded" },
      _sum: { amountLocal: true },
      _count: { _all: true },
    }),
    prisma.invoice.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.refund.count({ where: { stage: "cm_approved" } }),
    prisma.commission.groupBy({ by: ["status"], _sum: { amountUsd: true } }),
    prisma.payout.groupBy({ by: ["status"], _sum: { amountUsd: true } }),
  ]);

  const inboundUsd = byCurrency.reduce((s, g) => s + toUsd(g._sum.amountLocal ?? 0, g.currency), 0);
  const paymentsCount = byCurrency.reduce((s, g) => s + g._count._all, 0);
  const invoiceCount = (status: string) =>
    invoiceCounts.find((i) => i.status === status)?._count._all ?? 0;
  const commissionUsd = (statuses: string[]) =>
    commissionSums.filter((c) => statuses.includes(c.status)).reduce((s, c) => s + (c._sum.amountUsd ?? 0), 0);
  const payoutUsd = (match: (status: string) => boolean) =>
    payoutSums.filter((p) => match(p.status)).reduce((s, p) => s + (p._sum.amountUsd ?? 0), 0);

  return {
    inboundUsd,
    paymentsCount,
    invoicesIssued: invoiceCount("issued"),
    invoicesPaid: invoiceCount("paid"),
    refundsPending,
    commissionExpectedUsd: commissionUsd(["expected", "invoiced"]),
    commissionReceivedUsd: commissionUsd(["received", "reconciled"]),
    payoutsScheduledUsd: payoutUsd((s) => s !== "paid"),
    payoutsPaidUsd: payoutUsd((s) => s === "paid"),
  };
}
