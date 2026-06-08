"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { destroyUserSession, SESSION_COOKIE } from "@/lib/sessions";
import { getCurrentSession } from "@/lib/current-user";
import { prisma } from "@/lib/db";
import { emit } from "@/lib/events";
import { logAudit } from "@/lib/audit";
import {
  ensureCommission,
  setCommissionStatus,
  createPayout,
  markPayoutPaid,
} from "@/lib/finance";

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
  const apps = await prisma.application.findMany({
    where: {
      submissionStatus: { in: ["offer_unconditional", "offer_conditional"] },
    },
    select: { id: true },
  });
  for (const a of apps) await ensureCommission(a.id);
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
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const reference = String(formData.get("reference") ?? "") || undefined;
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
  const id = String(formData.get("id"));
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
  const id = String(formData.get("id"));
  const r = await prisma.refund.update({
    where: { id },
    data: { stage: "finance_approved", financeApprovedBy: s.userId },
  });
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
  const id = String(formData.get("id"));
  const r = await prisma.refund.update({ where: { id }, data: { stage: "paid" } });
  await emit({
    type: "payment.received",
    stage: 7,
    studentId: r.studentId,
    actorType: "finance",
    actorId: s.userId,
    visibility: { S: true, P: true, F: true },
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
