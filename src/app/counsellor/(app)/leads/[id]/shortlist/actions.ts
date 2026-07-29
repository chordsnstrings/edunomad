"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { addToShortlist } from "@/lib/shortlist";
import { emit } from "@/lib/events";
import { text, LIMITS } from "@/lib/form";

async function guard(studentId: string) {
  const session = await getCurrentSession();
  if (!session || !["counsellor", "counsellor_manager"].includes(session.role)) redirect("/counsellor/login");
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) redirect("/counsellor");
  if (session.role === "counsellor" && student.assignedCounsellorId !== session.userId) redirect("/counsellor");
  return session;
}

export async function recommendProgrammeAction(formData: FormData) {
  const studentId = text(formData, "studentId");
  const programmeId = text(formData, "programmeId");
  const rationale = text(formData, "rationale", LIMITS.longText);
  const session = await guard(studentId);
  const res = await addToShortlist(studentId, programmeId, { recommendedByCounsellor: true, actorType: "counsellor", actorId: session.userId });
  if (res.ok && res.application && rationale) {
    await prisma.application.update({ where: { id: res.application.id }, data: { rationale } });
  }
  redirect(`/counsellor/leads/${studentId}/shortlist`);
}

export async function suggestRemovalAction(formData: FormData) {
  const studentId = text(formData, "studentId");
  const applicationId = text(formData, "applicationId");
  const session = await guard(studentId);
  await emit({
    type: "shortlist.removal_suggested",
    stage: 3,
    studentId,
    applicationId,
    actorType: "counsellor",
    actorId: session.userId,
    visibility: { S: true, C: true },
    channels: { in_app: true },
    payload: {},
  });
  redirect(`/counsellor/leads/${studentId}/shortlist`);
}
