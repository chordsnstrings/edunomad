"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { emit } from "@/lib/events";
import { text } from "@/lib/form";

export async function auditPassAction(formData: FormData) {
  const s = await getCurrentSession();
  if (!s || s.role !== "operations_manager") redirect("/operations");
  const fileId = text(formData, "fileId");
  const vf = await prisma.visaFile.findUnique({ where: { id: fileId } });
  if (!vf) redirect("/operations/visa-audit");
  await emit({
    type: "visa.pre_compliance_audited",
    stage: 8,
    studentId: vf.studentId,
    applicationId: vf.applicationId,
    actorType: "ops_manager",
    actorId: s.userId,
    visibility: { O: true, OM: true, COMP: true },
    channels: { in_app: true },
    payload: {},
  });
  redirect("/operations/visa-audit");
}
