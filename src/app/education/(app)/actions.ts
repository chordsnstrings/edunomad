"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { destroyUserSession, SESSION_COOKIE } from "@/lib/sessions";
import { getCurrentSession } from "@/lib/current-user";
import { prisma } from "@/lib/db";
import { emit } from "@/lib/events";
import { logAudit } from "@/lib/audit";

async function em() {
  const s = await getCurrentSession();
  if (!s || s.role !== "education_manager") redirect("/education/login");
  return s;
}

export async function educationLogoutAction() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await destroyUserSession(token);
  store.delete(SESSION_COOKIE);
  redirect("/education/login");
}

/** Acknowledge an escalation/exception as reviewed (oversight, §6 escalation approve). */
export async function acknowledgeEscalationAction(formData: FormData) {
  const s = await em();
  const studentId = String(formData.get("studentId"));
  await emit({
    type: "escalation.acknowledged",
    stage: 2,
    studentId,
    actorType: "education_manager",
    actorId: s.userId,
    visibility: { C: true, CM: true, EM: true },
    channels: { in_app: true },
    payload: {},
  });
  await logAudit({
    actorUserId: s.userId,
    action: "exception.approve",
    targetType: "Student",
    targetId: studentId,
    result: "success",
  });
  redirect("/education/escalations");
}

/** Approve (activate) or pause a partner university (§6 partner_university approve). */
export async function toggleInstitutionAction(formData: FormData) {
  const s = await em();
  const id = String(formData.get("id"));
  const active = String(formData.get("active")) === "true";
  await prisma.institution.update({ where: { id }, data: { active } });
  await logAudit({
    actorUserId: s.userId,
    action: "partner_university.approve",
    targetType: "Institution",
    targetId: id,
    result: "success",
  });
  redirect("/education/partners");
}
