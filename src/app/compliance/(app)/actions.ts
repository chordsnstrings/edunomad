"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { destroyUserSession, SESSION_COOKIE } from "@/lib/sessions";
import { sendOtp, verifyOtpForReauth } from "@/lib/otp";
import { visaVersionHash } from "@/lib/visa";
import { getLatestDocuments } from "@/lib/documents";
import { emit, withEvents } from "@/lib/events";
import { logAudit } from "@/lib/audit";
import { text, LIMITS } from "@/lib/form";

/** Sentinel: the file was already signed, so the transaction rolls back. */
class AlreadySignedError extends Error {}

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
  redirect(`/compliance/files/${text(formData, "fileId")}?codesent=1`);
}

export async function signOffAction(formData: FormData) {
  const s = await compliance();
  const fileId = text(formData, "fileId");
  const code = text(formData, "code");
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
  // Sign once. Without this, re-posting the action created a second
  // ComplianceSignOff row for the same file.
  if (vf.signedOffAt) redirect(`/compliance/files/${fileId}?already=1`);

  // Bind the stamp to the packet that was actually signed. It previously hashed
  // `formIds: []` — referencing no document at all — over `vf.updatedAt` read
  // *before* the update below, so the value could not even be recomputed from the
  // stored row. Include each document's type, version and storage key, and stamp
  // a timestamp we control and persist.
  const latest = await getLatestDocuments(vf.studentId);
  const signedAt = new Date();
  const versionHash = visaVersionHash({
    completenessPct: vf.completenessPct,
    formIds: [...latest.values()].map((d) => `${d.documentType}:v${d.version}:${d.storageKey}`),
    updatedAt: signedAt,
  });
  // The stamp, the immutable sign-off record and the chain entry are one legal
  // act: they must commit together or not at all. Sign-once is enforced in the
  // same transaction so two concurrent submissions cannot both sign.
  await withEvents(async (tx) => {
    const signed = await tx.visaFile.updateMany({
      where: { id: fileId, signedOffAt: null },
      data: { signedOffAt: signedAt, signedOffBy: s.userId, registrationNumber: rcic.registrationNumber, versionHash, returnedForChanges: false },
    });
    if (signed.count !== 1) throw new AlreadySignedError();
    await tx.complianceSignOff.create({ data: { visaFileId: fileId, complianceUserId: s.userId, registrationNumber: rcic.registrationNumber, versionHash } });
    await emit(
      {
        type: "visa.signed_off",
        stage: 8,
        studentId: vf.studentId,
        applicationId: vf.applicationId,
        actorType: "compliance",
        actorId: s.userId,
        visibility: { S: true, C: true, O: true, OM: true, COMP: true },
        channels: { in_app: true, push: true },
        payload: { registrationNumber: rcic.registrationNumber },
      },
      tx,
    );
  }).catch((e) => {
    if (e instanceof AlreadySignedError) redirect(`/compliance/files/${fileId}?already=1`);
    throw e;
  });
  await logAudit({ actorUserId: s.userId, action: "visa_file.signed_off", targetType: "VisaFile", targetId: fileId, result: "success", reason: `RCIC ${rcic.registrationNumber} · hash ${versionHash}` });
  redirect(`/compliance/files/${fileId}?signed=1`);
}

export async function returnForChangesAction(formData: FormData) {
  const s = await compliance();
  const fileId = text(formData, "fileId");
  const reason = text(formData, "reason", LIMITS.longText);
  const vf = await prisma.visaFile.findUnique({ where: { id: fileId } });
  if (!vf) redirect("/compliance");
  await prisma.visaFile.update({ where: { id: fileId }, data: { returnedForChanges: true, returnReason: reason, readyForSignoffAt: null } });
  await emit({ type: "visa.returned_for_changes", stage: 8, studentId: vf.studentId, applicationId: vf.applicationId, actorType: "compliance", actorId: s.userId, visibility: { O: true, OM: true, COMP: true }, channels: { in_app: true }, payload: { reason } });
  redirect("/compliance");
}

export async function refuseToSignAction(formData: FormData) {
  const s = await compliance();
  const fileId = text(formData, "fileId");
  const reason = text(formData, "reason", LIMITS.longText);
  const vf = await prisma.visaFile.findUnique({ where: { id: fileId } });
  if (!vf) redirect("/compliance");
  await prisma.visaFile.update({ where: { id: fileId }, data: { refusalReasons: [reason] as unknown as Prisma.InputJsonValue, readyForSignoffAt: null } });
  await emit({ type: "visa.signoff_refused", stage: 8, studentId: vf.studentId, applicationId: vf.applicationId, actorType: "compliance", actorId: s.userId, visibility: { O: true, OM: true, COMP: true, EM: true }, channels: { in_app: true, push: true }, payload: { reason } });
  await logAudit({ actorUserId: s.userId, action: "visa_file.signoff_refused", targetType: "VisaFile", targetId: fileId, result: "success", reason });
  redirect("/compliance");
}

export async function createBulletinAction(formData: FormData) {
  const s = await compliance();
  await prisma.bulletin.create({ data: { authorUserId: s.userId, title: text(formData, "title"), body: text(formData, "body", LIMITS.longText), destination: text(formData, "destination") || null } });
  await logAudit({ actorUserId: s.userId, action: "regulatory_bulletin.create", targetType: "Bulletin", result: "success" });
  redirect("/compliance/bulletins");
}

export async function createRegUpdateAction(formData: FormData) {
  const s = await compliance();
  const eff = text(formData, "effectiveDate");
  await prisma.regulatoryUpdate.create({ data: { authorUserId: s.userId, destination: text(formData, "destination"), summary: text(formData, "summary", LIMITS.longText), effectiveDate: eff ? new Date(eff) : null } });
  redirect("/compliance/bulletins");
}

export async function notifyRegulatorAction(formData: FormData) {
  const s = await compliance();
  const fileId = text(formData, "fileId");
  await prisma.regulatorNotification.create({ data: { authorUserId: s.userId, visaFileId: fileId || null, regulator: text(formData, "regulator"), subject: text(formData, "subject"), body: text(formData, "body", LIMITS.longText) } });
  await logAudit({ actorUserId: s.userId, action: "regulator_notification.create", targetType: "VisaFile", targetId: fileId || null, result: "success", reason: "regulator notified" });
  const vf = fileId ? await prisma.visaFile.findUnique({ where: { id: fileId } }) : null;
  if (vf) await emit({ type: "compliance.regulator_notified", stage: 8, studentId: vf.studentId, applicationId: vf.applicationId, actorType: "compliance", actorId: s.userId, visibility: { COMP: true, EM: true, ADMIN: true }, channels: { in_app: true }, payload: {} });
  redirect(fileId ? `/compliance/files/${fileId}` : "/compliance");
}
