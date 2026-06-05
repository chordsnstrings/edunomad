"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { destroyUserSession, SESSION_COOKIE } from "@/lib/sessions";
import { sendOtp, verifyOtpForReauth } from "@/lib/otp";
import { visaVersionHash } from "@/lib/visa";
import { emit } from "@/lib/events";
import { logAudit } from "@/lib/audit";

// SOLE sign-off authority is the Compliance role (CLAUDE.md §1.12). Deny by default.
async function compliance() {
  const s = await getCurrentSession();
  if (!s || s.role !== "compliance") redirect("/compliance/login");
  return s;
}

export async function complianceLogoutAction() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await destroyUserSession(token);
  store.delete(SESSION_COOKIE);
  redirect("/compliance/login");
}

export async function sendReauthCodeAction(formData: FormData) {
  const s = await compliance();
  const user = await prisma.user.findUnique({ where: { id: s.userId } });
  if (user) await sendOtp(user.phone);
  redirect(`/compliance/files/${String(formData.get("fileId"))}?codesent=1`);
}

export async function signOffAction(formData: FormData) {
  const s = await compliance();
  const fileId = String(formData.get("fileId"));
  const code = String(formData.get("code") ?? "");
  const user = await prisma.user.findUnique({ where: { id: s.userId } });
  if (!user) redirect("/compliance/login");

  // Re-authenticate (fresh OTP) before signing.
  if (!(await verifyOtpForReauth(user.phone, code))) {
    await logAudit({ actorUserId: s.userId, action: "visa_file.signed_off", targetType: "VisaFile", targetId: fileId, result: "denied", reason: "re-auth failed" });
    redirect(`/compliance/files/${fileId}?reauth=failed`);
  }
  const rcic = await prisma.rcicProfile.findUnique({ where: { userId: s.userId } });
  if (!rcic) redirect(`/compliance/files/${fileId}?error=no_registration`);
  const vf = await prisma.visaFile.findUnique({ where: { id: fileId } });
  if (!vf) redirect("/compliance");

  const versionHash = visaVersionHash({ completenessPct: vf.completenessPct, formIds: [], updatedAt: vf.updatedAt });
  await prisma.visaFile.update({ where: { id: fileId }, data: { signedOffAt: new Date(), signedOffBy: s.userId, registrationNumber: rcic.registrationNumber, versionHash, returnedForChanges: false } });
  await prisma.complianceSignOff.create({ data: { visaFileId: fileId, complianceUserId: s.userId, registrationNumber: rcic.registrationNumber, versionHash } });
  await emit({
    type: "visa.signed_off",
    stage: 8,
    studentId: vf.studentId,
    applicationId: vf.applicationId,
    actorType: "compliance",
    actorId: s.userId,
    visibility: { S: true, C: true, O: true, OM: true, COMP: true },
    channels: { in_app: true, push: true },
    payload: { registrationNumber: rcic.registrationNumber },
  });
  await logAudit({ actorUserId: s.userId, action: "visa_file.signed_off", targetType: "VisaFile", targetId: fileId, result: "success", reason: `RCIC ${rcic.registrationNumber} · hash ${versionHash}` });
  redirect(`/compliance/files/${fileId}?signed=1`);
}

export async function returnForChangesAction(formData: FormData) {
  const s = await compliance();
  const fileId = String(formData.get("fileId"));
  const reason = String(formData.get("reason") ?? "");
  const vf = await prisma.visaFile.findUnique({ where: { id: fileId } });
  if (!vf) redirect("/compliance");
  await prisma.visaFile.update({ where: { id: fileId }, data: { returnedForChanges: true, returnReason: reason, readyForSignoffAt: null } });
  await emit({ type: "visa.returned_for_changes", stage: 8, studentId: vf.studentId, applicationId: vf.applicationId, actorType: "compliance", actorId: s.userId, visibility: { O: true, OM: true, COMP: true }, channels: { in_app: true }, payload: { reason } });
  redirect("/compliance");
}

export async function refuseToSignAction(formData: FormData) {
  const s = await compliance();
  const fileId = String(formData.get("fileId"));
  const reason = String(formData.get("reason") ?? "");
  const vf = await prisma.visaFile.findUnique({ where: { id: fileId } });
  if (!vf) redirect("/compliance");
  await prisma.visaFile.update({ where: { id: fileId }, data: { refusalReasons: [reason] as unknown as Prisma.InputJsonValue, readyForSignoffAt: null } });
  await emit({ type: "visa.signoff_refused", stage: 8, studentId: vf.studentId, applicationId: vf.applicationId, actorType: "compliance", actorId: s.userId, visibility: { O: true, OM: true, COMP: true, EM: true }, channels: { in_app: true, push: true }, payload: { reason } });
  await logAudit({ actorUserId: s.userId, action: "visa_file.signoff_refused", targetType: "VisaFile", targetId: fileId, result: "success", reason });
  redirect("/compliance");
}

export async function createBulletinAction(formData: FormData) {
  const s = await compliance();
  await prisma.bulletin.create({ data: { authorUserId: s.userId, title: String(formData.get("title") ?? ""), body: String(formData.get("body") ?? ""), destination: String(formData.get("destination") ?? "") || null } });
  await logAudit({ actorUserId: s.userId, action: "regulatory_bulletin.create", targetType: "Bulletin", result: "success" });
  redirect("/compliance/bulletins");
}

export async function createRegUpdateAction(formData: FormData) {
  const s = await compliance();
  const eff = String(formData.get("effectiveDate") ?? "");
  await prisma.regulatoryUpdate.create({ data: { authorUserId: s.userId, destination: String(formData.get("destination") ?? "CA"), summary: String(formData.get("summary") ?? ""), effectiveDate: eff ? new Date(eff) : null } });
  redirect("/compliance/bulletins");
}

export async function notifyRegulatorAction(formData: FormData) {
  const s = await compliance();
  const fileId = String(formData.get("fileId") ?? "");
  await prisma.regulatorNotification.create({ data: { authorUserId: s.userId, visaFileId: fileId || null, regulator: String(formData.get("regulator") ?? "RCIC"), subject: String(formData.get("subject") ?? ""), body: String(formData.get("body") ?? "") } });
  await logAudit({ actorUserId: s.userId, action: "regulator_notification.create", targetType: "VisaFile", targetId: fileId || null, result: "success", reason: "regulator notified" });
  const vf = fileId ? await prisma.visaFile.findUnique({ where: { id: fileId } }) : null;
  if (vf) await emit({ type: "compliance.regulator_notified", stage: 8, studentId: vf.studentId, applicationId: vf.applicationId, actorType: "compliance", actorId: s.userId, visibility: { COMP: true, EM: true, ADMIN: true }, channels: { in_app: true }, payload: {} });
  redirect(fileId ? `/compliance/files/${fileId}` : "/compliance");
}
