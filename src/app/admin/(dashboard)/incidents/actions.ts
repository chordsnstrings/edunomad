"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { RUNBOOKS } from "@/lib/incident";
import { emit } from "@/lib/events";
import { logAudit } from "@/lib/audit";
import { text, LIMITS } from "@/lib/form";

async function admin() {
  const s = await requireAdmin();
  return s;
}

export async function createIncidentAction(formData: FormData) {
  const s = await admin();
  const title = text(formData, "title") || "Untitled incident";
  const severity = text(formData, "severity");
  const runbook = (RUNBOOKS[severity] ?? RUNBOOKS.sev3) as unknown as Prisma.InputJsonValue;
  const inc = await prisma.incident.create({ data: { title, severity, createdByUserId: s.sub, runbook } });
  await emit({ type: "incident.created", stage: 2, actorType: "super_admin", actorId: s.sub, visibility: { ADMIN: true, COMP: true, EM: true }, channels: { in_app: true, push: true }, payload: { severity, title } });
  await logAudit({ actorUserId: s.sub, action: "incident.created", targetType: "Incident", targetId: inc.id, result: "success", reason: severity });
  redirect(`/admin/incidents/${inc.id}`);
}

export async function resolveIncidentAction(formData: FormData) {
  await admin();
  const id = text(formData, "id");
  await prisma.incident.update({ where: { id }, data: { status: "resolved", resolvedAt: new Date() } });
  redirect(`/admin/incidents/${id}`);
}

export async function scheduleReviewAction(formData: FormData) {
  await admin();
  const id = text(formData, "id");
  const when = text(formData, "when");
  await prisma.incident.update({ where: { id }, data: { reviewScheduledAt: when ? new Date(when) : null, reviewNotes: text(formData, "notes", LIMITS.longText) } });
  redirect(`/admin/incidents/${id}`);
}
