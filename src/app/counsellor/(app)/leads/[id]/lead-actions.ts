"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { emit } from "@/lib/events";

export async function reassignAction(formData: FormData) {
  const s = await getCurrentSession();
  if (!s || s.role !== "counsellor_manager") redirect("/counsellor");
  const studentId = String(formData.get("studentId"));
  const counsellorUserId = String(formData.get("counsellorUserId"));
  await prisma.student.update({ where: { id: studentId }, data: { assignedCounsellorId: counsellorUserId } });
  await emit({ type: "counsellor.reassigned", stage: 2, studentId, actorType: "counsellor_manager", actorId: s.userId, visibility: { S: true, C: true, CM: true }, channels: { in_app: true }, payload: { counsellorUserId } });
  redirect(`/counsellor/leads/${studentId}`);
}
