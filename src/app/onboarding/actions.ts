"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { getMyStudent, computeCompleteness } from "@/lib/student";
import { emit } from "@/lib/events";

/** Finalise the profile: recompute completeness, emit profile.completed, go to eligibility. */
export async function submitProfileAction() {
  const session = await getCurrentSession();
  if (!session) redirect("/signup");
  const student = await getMyStudent(session.userId);
  if (!student) redirect("/welcome");

  const completenessPct = computeCompleteness(student as unknown as Record<string, unknown>);
  await prisma.student.update({ where: { id: student.id }, data: { completenessPct } });
  await emit({
    type: "profile.completed",
    stage: 1,
    studentId: student.id,
    actorType: "student",
    actorId: session.userId,
    visibility: { S: true, C: true, CM: true },
    channels: { in_app: true },
    payload: { completenessPct },
  });
  redirect("/eligibility");
}
