"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { emit } from "@/lib/events";
import { logAudit } from "@/lib/audit";
import { text, int, LIMITS } from "@/lib/form";

async function cm() {
  const s = await getCurrentSession();
  if (!s || s.role !== "counsellor_manager") redirect("/counsellor");
  return s;
}

export async function requestRefundAction(formData: FormData) {
  const s = await cm();
  const studentId = text(formData, "studentId");
  // `Number(...)` with only a falsy check let a negative amount through, so a
  // refund request could be entered for -50,000 — which reads as a charge once
  // it reaches Finance. Bound it on both ends.
  const amount = int(formData, "amount", { min: 1, max: 10_000_000, fallback: 0 });
  const reason = text(formData, "reason", LIMITS.longText);
  if (!studentId || amount <= 0) redirect("/counsellor/refunds?error=amount");
  await prisma.refund.create({ data: { studentId, requestedByUserId: s.userId, amountLocal: amount, reason } });
  redirect("/counsellor/refunds");
}

export async function approveRefundAction(formData: FormData) {
  const s = await cm();
  const id = text(formData, "id");
  const r = await prisma.refund.update({ where: { id }, data: { stage: "cm_approved", cmApprovedBy: s.userId } });
  await emit({ type: "refund.cm_approved", stage: 7, studentId: r.studentId, actorType: "counsellor_manager", actorId: s.userId, visibility: { CM: true, F: true, EM: true }, channels: { in_app: true }, payload: { amount: r.amountLocal } });
  await logAudit({ actorUserId: s.userId, action: "refund.approve", targetType: "Refund", targetId: id, result: "success" });
  redirect("/counsellor/refunds");
}
