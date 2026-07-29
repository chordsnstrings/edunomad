"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { emit } from "@/lib/events";
import { logAudit } from "@/lib/audit";
import { text } from "@/lib/form";

export async function approveAction(formData: FormData) {
  const s = await getCurrentSession();
  if (!s || s.role !== "operations_manager") redirect("/operations");
  const appId = text(formData, "appId");
  const app = await prisma.application.update({ where: { id: appId }, data: { opsApproved: true } });
  await emit({
    type: "application.approved",
    stage: 4,
    studentId: app.studentId,
    applicationId: app.id,
    actorType: "ops_manager",
    actorId: s.userId,
    visibility: { O: true, OM: true, C: true },
    channels: { in_app: true },
    payload: {},
  });
  await logAudit({ actorUserId: s.userId, action: "application.approve", targetType: "Application", targetId: app.id, result: "success" });
  redirect("/operations/approvals");
}
