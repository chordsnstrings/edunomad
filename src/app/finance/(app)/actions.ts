"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { destroyUserSession, SESSION_COOKIE } from "@/lib/sessions";
import { getCurrentSession } from "@/lib/current-user";
import { prisma } from "@/lib/db";
import { emit } from "@/lib/events";
import { logAudit } from "@/lib/audit";
import { AUDIENCE } from "@/lib/event-visibility";
import {
  ensureCommission,
  setCommissionStatus,
  createPayout,
  markPayoutPaid,
} from "@/lib/finance";
import { text } from "@/lib/form";

async function fin() {
  const s = await getCurrentSession();
  if (!s || s.role !== "finance") redirect("/finance/login");
  return s;
}

export async function financeLogoutAction() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await destroyUserSession(token);
  store.delete(SESSION_COOKIE);
  redirect("/finance/login");
}

/** Accrue expected commissions for every offered application missing one. */
export async function generateCommissionsAction() {
  await fin();
  // Only applications that do not already have a commission, so a second click
  // is cheap instead of re-scanning and re-checking every offer ever made.
  const existing = await prisma.commission.findMany({ select: { applicationId: true } });
  const done = new Set(existing.map((c) => c.applicationId));
  const apps = await prisma.application.findMany({
    where: {
      submissionStatus: { in: ["offer_unconditional", "offer_conditional"] },
      id: { notIn: [...done] },
    },
    select: { id: true },
    take: 500,
  });
  // Bounded concurrency: sequential awaits made this O(offers) round-trips.
  for (let i = 0; i < apps.length; i += 10) {
    await Promise.all(apps.slice(i, i + 10).map((a) => ensureCommission(a.id)));
  }
  redirect("/finance/commissions");
}

const COMMISSION_STATUSES = [
  "expected",
  "invoiced",
  "received",
  "reconciled",
  "written_off",
] as const;

export async function setCommissionStatusAction(formData: FormData) {
  const s = await fin();
  const id = text(formData, "id");
  const status = text(formData, "status");
  const reference = text(formData, "reference") || undefined;
  if ((COMMISSION_STATUSES as readonly string[]).includes(status)) {
    await setCommissionStatus(
      id,
      status as (typeof COMMISSION_STATUSES)[number],
      reference,
    );
    await logAudit({
      actorUserId: s.userId,
      action: "commission.edit",
      targetType: "Commission",
      targetId: id,
      result: "success",
    });
  }
  redirect("/finance/commissions");
}

export async function createPayoutAction() {
  const s = await fin();
  const received = await prisma.commission.findMany({
    where: { status: "received", payoutId: null },
    select: { id: true },
  });
  const payout = await createPayout(
    received.map((c) => c.id),
    s.userId,
  );
  if (payout) {
    await logAudit({
      actorUserId: s.userId,
      action: "payout.approve",
      targetType: "Payout",
      targetId: payout.id,
      result: "success",
    });
  }
  redirect("/finance/payouts");
}

export async function markPayoutPaidAction(formData: FormData) {
  const s = await fin();
  const id = text(formData, "id");
  await markPayoutPaid(id);
  await logAudit({
    actorUserId: s.userId,
    action: "payout.approve",
    targetType: "Payout",
    targetId: id,
    result: "success",
  });
  redirect("/finance/payouts");
}

/** Finance leg of the refund chain: cm_approved → finance_approved → paid. */
export async function financeApproveRefundAction(formData: FormData) {
  const s = await fin();
  const id = text(formData, "id");
  // Guard the transition server-side. The page only renders this button for a
  // cm_approved refund, but server actions are directly invokable, so without a
  // stage predicate a refund could skip the counsellor-manager approval step.
  const moved = await prisma.refund.updateMany({
    where: { id, stage: "cm_approved" },
    data: { stage: "finance_approved", financeApprovedBy: s.userId },
  });
  if (moved.count !== 1) redirect("/finance/refunds?error=stale");
  const r = await prisma.refund.findUniqueOrThrow({ where: { id } });
  await emit({
    type: "refund.finance_approved",
    stage: 7,
    studentId: r.studentId,
    actorType: "finance",
    actorId: s.userId,
    visibility: { F: true, CM: true, EM: true },
    channels: { in_app: true },
    payload: { amount: r.amountLocal },
  });
  await logAudit({
    actorUserId: s.userId,
    action: "refund.approve",
    targetType: "Refund",
    targetId: id,
    result: "success",
  });
  redirect("/finance/refunds");
}

export async function payRefundAction(formData: FormData) {
  const s = await fin();
  const id = text(formData, "id");
  // Only a finance-approved refund may be paid, and only once — otherwise the
  // same refund could be paid repeatedly, each time emitting payment.received.
  const paid = await prisma.refund.updateMany({
    where: { id, stage: "finance_approved" },
    data: { stage: "paid" },
  });
  if (paid.count !== 1) redirect("/finance/refunds?error=stale");
  const r = await prisma.refund.findUniqueOrThrow({ where: { id } });
  await emit({
    type: "payment.received",
    stage: 7,
    studentId: r.studentId,
    actorType: "finance",
    actorId: s.userId,
    visibility: AUDIENCE.money,
    channels: { in_app: true, push: true },
    payload: { amount: r.amountLocal, currency: r.currency, purpose: "refund" },
  });
  await logAudit({
    actorUserId: s.userId,
    action: "refund.paid",
    targetType: "Refund",
    targetId: id,
    result: "success",
  });
  redirect("/finance/refunds");
}
