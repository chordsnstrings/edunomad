"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";
import { TENANT_ID } from "@/lib/tenant";
import { pinHash } from "@/lib/parent";
import { sendOtp, verifyOtpForReauth } from "@/lib/otp";
import { createUserSession, SESSION_COOKIE } from "@/lib/sessions";
import { emit } from "@/lib/events";
import { text } from "@/lib/form";

export async function sendParentCodeAction(formData: FormData) {
  const id = text(formData, "id");
  const invite = await prisma.parentInvite.findUnique({ where: { id } });
  if (invite && invite.status === "sent") await sendOtp(invite.parentPhone);
  redirect(`/parent/accept/${id}?codesent=1`);
}

export async function acceptInviteAction(formData: FormData) {
  const id = text(formData, "id");
  const pin = text(formData, "pin");
  const code = text(formData, "code");
  const invite = await prisma.parentInvite.findUnique({ where: { id } });
  if (!invite || invite.status !== "sent") redirect(`/parent/accept/${id}`);
  if (invite.pinHash !== pinHash(pin)) redirect(`/parent/accept/${id}?pin=bad`);
  if (!(await verifyOtpForReauth(invite.parentPhone, code))) redirect(`/parent/accept/${id}?code=bad`);

  let user = await prisma.user.findUnique({ where: { phone: invite.parentPhone } });
  if (!user) {
    const uid = randomUUID();
    user = await prisma.user.create({ data: { id: uid, phone: invite.parentPhone, tenant: "student", tenantId: TENANT_ID.student, role: "parent" } });
  }
  await prisma.parentInvite.update({ where: { id }, data: { status: "accepted", parentUserId: user.id, acceptedAt: new Date() } });
  const { token } = await createUserSession({ id: user.id, tenant: user.tenant, role: user.role });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 12 * 3600 });
  await emit({ type: "parent.joined", stage: 2, studentId: invite.studentId, actorType: "parent", actorId: user.id, visibility: { S: true, P: true, C: true }, channels: { in_app: true }, payload: {} });
  redirect("/parent");
}
