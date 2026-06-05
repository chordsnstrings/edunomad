"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { emit } from "@/lib/events";
import { logAudit } from "@/lib/audit";

async function cm() {
  const s = await getCurrentSession();
  if (!s || s.role !== "counsellor_manager") redirect("/counsellor");
  return s;
}

export async function requestRefundAction(formData: FormData) {
  const s = await cm();
  const studentId = String(formData.get("studentId") ?? "").trim();
  const amount = Number(formData.get("amount") ?? 0);
  const reason = String(formData.get("reason") ?? "");
  if (!studentId || !amount) redirect("/counsellor/refunds");
  await prisma.refund.create({ data: { studentId, requestedByUserId: s.userId, amountLocal: amount, reason } });
  redirect("/counsellor/refunds");
}

export async function approveRefundAction(formData: FormData) {
  const s = await cm();
  const id = String(formData.get("id"));
  const r = await prisma.refund.update({ where: { id }, data: { stage: "cm_approved", cmApprovedBy: s.userId } });
  await emit({ type: "refund.cm_approved", stage: 7, studentId: r.studentId, actorType: "counsellor_manager", actorId: s.userId, visibility: { CM: true, F: true, EM: true }, channels: { in_app: true }, payload: { amount: r.amountLocal } });
  await logAudit({ actorUserId: s.userId, action: "refund.approve", targetType: "Refund", targetId: id, result: "success" });
  redirect("/counsellor/refunds");
}
