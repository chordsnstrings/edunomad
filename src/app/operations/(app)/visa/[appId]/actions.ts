"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { visaCompleteness } from "@/lib/visa";
import { getLatestDocuments } from "@/lib/documents";
import { emit } from "@/lib/events";

export async function readyForSignoffAction(formData: FormData) {
  const s = await getCurrentSession();
  if (!s || !["operations_team", "operations_manager"].includes(s.role)) redirect("/operations/login");
  const appId = String(formData.get("appId"));
  const vf = await prisma.visaFile.findUnique({ where: { applicationId: appId } });
  if (!vf) redirect("/operations");
  const latest = await getLatestDocuments(vf.studentId);
  const completeness = visaCompleteness(vf.destinationCountry, latest);
  await prisma.visaFile.update({ where: { id: vf.id }, data: { completenessPct: completeness, readyForSignoffAt: new Date() } });
  await emit({
    type: "visa.ready_for_signoff",
    stage: 8,
    studentId: vf.studentId,
    applicationId: appId,
    actorType: "ops",
    actorId: s.userId,
    visibility: { O: true, OM: true, COMP: true },
    channels: { in_app: true },
    payload: { completeness },
  });
  redirect(`/operations/visa/${appId}`);
}
