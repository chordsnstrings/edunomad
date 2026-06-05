"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { getMyStudent, computeCompleteness } from "@/lib/student";
import { computeLeadScore } from "@/lib/leadscore";
import { emit } from "@/lib/events";
import { assignCounsellor } from "@/lib/routing";

/** Finalise the profile: recompute completeness, emit profile.completed, go to eligibility. */
export async function submitProfileAction() {
  const session = await getCurrentSession();
  if (!session) redirect("/signup");
  const student = await getMyStudent(session.userId);
  if (!student) redirect("/welcome");

  const completenessPct = computeCompleteness(student as unknown as Record<string, unknown>);
  const leadScore = computeLeadScore({ ...(student as object), completenessPct } as Parameters<typeof computeLeadScore>[0]);
  await prisma.student.update({ where: { id: student.id }, data: { completenessPct, leadScore } });
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
  // Auto-assign a counsellor (routes to the CM queue if none fit).
  await assignCounsellor(student.id);
  redirect("/eligibility");
}
