"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { getMyStudent } from "@/lib/student";
import { pinHash } from "@/lib/parent";
import { sendSms } from "@/lib/sms";
import { emit } from "@/lib/events";
import { rateLimit } from "@/lib/ratelimit";

export async function inviteParentAction(formData: FormData) {
  const s = await getCurrentSession();
  if (!s || s.role !== "student") redirect("/signup");
  const student = await getMyStudent(s.userId);
  if (!student) redirect("/welcome");
  const phone = String(formData.get("phone") ?? "").trim();
  const pin = String(formData.get("pin") ?? "").trim();
  if (!/^\+?[1-9]\d{9,14}$/.test(phone.replace(/[\s-]/g, "")) || !/^\d{4,6}$/.test(pin)) {
    redirect("/app/parent?error=1");
  }
  // This sends an SMS to a caller-supplied number, so it is an open relay
  // without a limit (cost + abuse). Three invites per student per hour.
  const limit = rateLimit(`parent:invite:${student.id}`, 3, 60 * 60 * 1000);
  if (!limit.ok) redirect("/app/parent?error=rate_limited");

  const invite = await prisma.parentInvite.create({ data: { studentId: student.id, parentPhone: phone, pinHash: pinHash(pin) } });
  await sendSms(phone, `You're invited to follow ${student.fullName ?? "your child"}'s EduNomad journey. Open /parent/accept/${invite.id} and enter the PIN they shared.`);
  await emit({ type: "parent.invited", stage: 2, studentId: student.id, actorType: "student", actorId: s.userId, visibility: { S: true, P: true, C: true }, channels: { in_app: true, whatsapp: true }, payload: {} });
  redirect("/app/parent?sent=1");
}
