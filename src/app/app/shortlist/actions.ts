"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { getMyStudent } from "@/lib/student";
import { countShortlist, SHORTLIST_MAX } from "@/lib/shortlist";
import { emit } from "@/lib/events";

export async function lockShortlistAction() {
  const session = await getCurrentSession();
  if (!session) redirect("/signup");
  const student = await getMyStudent(session.userId);
  if (!student) redirect("/welcome");

  const count = await countShortlist(student.id);
  // Server-side quality gate (mirrors the UI).
  if ((student.completenessPct ?? 0) < 95 || count < 1 || count > SHORTLIST_MAX) {
    redirect("/app/shortlist?blocked=1");
  }

  await prisma.application.updateMany({
    where: { studentId: student.id, shortlistStatus: "draft" },
    data: { shortlistStatus: "locked" },
  });
  await emit({
    type: "shortlist.locked",
    stage: 3,
    studentId: student.id,
    actorType: "student",
    actorId: session.userId,
    visibility: { S: true, C: true, CM: true, O: true },
    channels: { in_app: true, push: true },
    payload: { count },
  });
  redirect("/app/shortlist?locked=1");
}
