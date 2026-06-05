"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { QA_CALL_RUBRIC } from "@/lib/reference/qa-call-rubric";
import { emit } from "@/lib/events";

export async function saveQaReviewAction(formData: FormData) {
  const s = await getCurrentSession();
  if (!s || s.role !== "counsellor_manager") redirect("/counsellor");
  const commId = String(formData.get("commId"));
  const comm = await prisma.communication.findUnique({ where: { id: commId } });
  if (!comm) redirect("/counsellor/qa");

  const scores: Record<string, boolean> = {};
  let total = 0;
  QA_CALL_RUBRIC.forEach((item, i) => {
    const passed = formData.get(`q${i}`) === "on";
    scores[item] = passed;
    if (passed) total++;
  });

  await prisma.qaReview.create({
    data: { counsellorUserId: comm.userId ?? "", reviewerUserId: s.userId, studentId: comm.studentId, communicationId: commId, scores: scores as Prisma.InputJsonValue, totalScore: total, notes: String(formData.get("notes") ?? "") },
  });
  await emit({ type: "qa.reviewed", stage: 2, studentId: comm.studentId, actorType: "counsellor_manager", actorId: s.userId, visibility: { CM: true, C: true }, channels: { in_app: true }, payload: { totalScore: total } });
  redirect("/counsellor/qa");
}
