"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { logAudit } from "@/lib/audit";

export async function eraseStudentAction(formData: FormData) {
  const s = await requireAdmin();
  const studentId = String(formData.get("studentId"));
  // Never erase while a visa file is in flight (regulatory retention).
  const inFlight = await prisma.visaFile.findFirst({ where: { studentId, decisionStatus: "pending" } });
  if (inFlight) {
    await logAudit({ actorUserId: s.sub, action: "data_export.erasure", targetType: "Student", targetId: studentId, result: "denied", reason: "visa file in flight" });
    redirect("/admin/dsar?error=in_flight");
  }
  await prisma.student.update({ where: { id: studentId }, data: { fullName: "[erased]", email: null, dateOfBirth: null, sourceAttribution: Prisma.JsonNull, fundingSource: null } });
  await logAudit({ actorUserId: s.sub, action: "data_export.erasure", targetType: "Student", targetId: studentId, result: "success", reason: "DSAR erasure" });
  redirect("/admin/dsar?erased=1");
}
