"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { getMyStudent } from "@/lib/student";
import { INVITE_TTL_MS, pinHash } from "@/lib/parent";
import { sendSms } from "@/lib/sms";
import { emit } from "@/lib/events";
import { rateLimit } from "@/lib/ratelimit";
import { text } from "@/lib/form";

export async function inviteParentAction(formData: FormData) {
  const s = await getCurrentSession();
  if (!s || s.role !== "student") redirect("/signup");
  const student = await getMyStudent(s.userId);
  if (!student) redirect("/welcome");
  const phone = text(formData, "phone");
  const pin = text(formData, "pin");
  if (!/^\+?[1-9]\d{9,14}$/.test(phone.replace(/[\s-]/g, "")) || !/^\d{4,6}$/.test(pin)) {
    redirect("/app/parent?error=1");
  }
  // This sends an SMS to a caller-supplied number, so it is an open relay
  // without a limit (cost + abuse). Three invites per student per hour.
  const limit = rateLimit(`parent:invite:${student.id}`, 3, 60 * 60 * 1000);
  if (!limit.ok) redirect("/app/parent?error=rate_limited");

  // An invite carries a 4-6 digit PIN to a phone number the student typed. Left
  // open forever, a mistyped digit means a stranger's phone holds a permanent
  // key to a student's file; a real expiry bounds that to a week.
  const expiresAt = new Date(Date.now() + INVITE_TTL_MS);
  const invite = await prisma.parentInvite.create({ data: { studentId: student.id, parentPhone: phone, pinHash: pinHash(pin), expiresAt } });
  await sendSms(phone, `You're invited to follow ${student.fullName ?? "your child"}'s EduNomad journey. Open /parent/accept/${invite.id} and enter the PIN they shared.`);
  await emit({ type: "parent.invited", stage: 2, studentId: student.id, actorType: "student", actorId: s.userId, visibility: { S: true, P: true, C: true }, channels: { in_app: true, whatsapp: true }, payload: {} });
  redirect("/app/parent?sent=1");
}
