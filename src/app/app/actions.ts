"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { getMyStudent } from "@/lib/student";
import { emit } from "@/lib/events";

export async function sendStudentMessageAction(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) redirect("/signup");
  const student = await getMyStudent(session.userId);
  if (!student) redirect("/welcome");
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;

  await prisma.communication.create({
    data: { studentId: student.id, userId: session.userId, type: "message", direction: "inbound", content, language: student.language },
  });
  await emit({
    type: "message.sent",
    stage: 2,
    studentId: student.id,
    actorType: "student",
    actorId: session.userId,
    visibility: { S: true, C: true },
    channels: { in_app: true },
    payload: { preview: content.slice(0, 80) },
  });
  redirect("/app/messages");
}

export async function requestCallAction() {
  const session = await getCurrentSession();
  if (!session) redirect("/signup");
  const student = await getMyStudent(session.userId);
  if (!student) redirect("/welcome");
  await emit({
    type: "call.requested",
    stage: 2,
    studentId: student.id,
    actorType: "student",
    actorId: session.userId,
    visibility: { S: true, C: true, CM: true },
    channels: { in_app: true, push: true },
    payload: {},
  });
  redirect("/app?requested=1");
}
