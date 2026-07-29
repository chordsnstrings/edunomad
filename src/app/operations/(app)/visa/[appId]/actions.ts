"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { visaCompleteness } from "@/lib/visa";
import { getLatestDocuments } from "@/lib/documents";
import { emit } from "@/lib/events";

async function ops() {
  const s = await getCurrentSession();
  if (!s || !["operations_team", "operations_manager"].includes(s.role)) redirect("/operations/login");
  return s;
}
async function file(appId: string) {
  const vf = await prisma.visaFile.findUnique({ where: { applicationId: appId } });
  if (!vf) redirect("/operations");
  return vf;
}
async function notify(appId: string, type: string, actorId: string, payload: Record<string, unknown>, channels: Record<string, boolean> = { in_app: true }) {
  const vf = await file(appId);
  await emit({ type, stage: type === "visa.approved" || type === "visa.refused" ? 8 : 8, studentId: vf.studentId, applicationId: appId, actorType: "ops", actorId, visibility: { S: true, C: true, O: true, OM: true, COMP: true }, channels, payload });
}

export async function readyForSignoffAction(formData: FormData) {
  const s = await ops();
  const appId = String(formData.get("appId"));
  const vf = await file(appId);
  const latest = await getLatestDocuments(vf.studentId);
  const completeness = visaCompleteness(vf.destinationCountry, latest);
  await prisma.visaFile.update({ where: { id: vf.id }, data: { completenessPct: completeness, readyForSignoffAt: new Date() } });
  await emit({ type: "visa.ready_for_signoff", stage: 8, studentId: vf.studentId, applicationId: appId, actorType: "ops", actorId: s.userId, visibility: { O: true, OM: true, COMP: true }, channels: { in_app: true }, payload: { completeness } });
  redirect(`/operations/visa/${appId}`);
}

export async function bookVfsAction(formData: FormData) {
  const s = await ops();
  const appId = String(formData.get("appId"));
  const at = String(formData.get("datetime"));
  const vf = await file(appId);
  await prisma.visaFile.update({ where: { id: vf.id }, data: { vfsAppointmentAt: at ? new Date(at) : null } });
  await notify(appId, "visa.appointment_booked", s.userId, { at }, { in_app: true, push: true, whatsapp: true });
  redirect(`/operations/visa/${appId}`);
}

export async function biometricsAction(formData: FormData) {
  const s = await ops();
  const appId = String(formData.get("appId"));
  const vf = await file(appId);
  await prisma.visaFile.update({ where: { id: vf.id }, data: { biometricsDoneAt: new Date() } });
  await notify(appId, "visa.biometrics_done", s.userId, {});
  redirect(`/operations/visa/${appId}`);
}

export async function submitVisaAction(formData: FormData) {
  const s = await ops();
  const appId = String(formData.get("appId"));
  const ref = String(formData.get("ref") ?? "");
  const vf = await file(appId);
  if (!vf.signedOffAt || !ref) redirect(`/operations/visa/${appId}?error=1`);
  await prisma.visaFile.update({ where: { id: vf.id }, data: { submittedAt: new Date(), submissionProof: { ref } } });
  await notify(appId, "visa.submitted", s.userId, { ref }, { in_app: true, push: true });
  redirect(`/operations/visa/${appId}`);
}

export async function decisionAction(formData: FormData) {
  const s = await ops();
  const appId = String(formData.get("appId"));
  const decision = String(formData.get("decision"));
  const reason = String(formData.get("reason") ?? "");
  if (!["approved", "refused", "info_requested"].includes(decision)) redirect(`/operations/visa/${appId}`);
  const vf = await file(appId);
  // Record the decision once. visa.* decisions are Critical-tier notifications
  // (push + WhatsApp + email, non-disableable), so re-posting this action used to
  // tell the student their visa was decided all over again — and append another
  // immutable event each time.
  const recorded = await prisma.visaFile.updateMany({
    where: { id: vf.id, decisionStatus: { not: decision as "approved" | "refused" | "info_requested" } },
    data: { decisionStatus: decision as "approved" | "refused" | "info_requested", decisionAt: new Date(), refusalReasons: decision === "refused" ? ([reason] as unknown as Prisma.InputJsonValue) : undefined },
  });
  if (recorded.count !== 1) redirect(`/operations/visa/${appId}?already=1`);
  const type = decision === "approved" ? "visa.approved" : decision === "refused" ? "visa.refused" : "visa.info_requested";
  await notify(appId, type, s.userId, { reason }, { in_app: true, push: true, whatsapp: true, email: true });
  redirect(`/operations/visa/${appId}`);
}

export async function passportReturnedAction(formData: FormData) {
  const s = await ops();
  const appId = String(formData.get("appId"));
  const vf = await file(appId);
  await prisma.visaFile.update({ where: { id: vf.id }, data: { passportReturnedAt: new Date() } });
  await notify(appId, "visa.passport_returned", s.userId, {});
  redirect(`/operations/visa/${appId}`);
}
