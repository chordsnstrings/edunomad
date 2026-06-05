"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireParent } from "@/lib/parent";
import { emit } from "@/lib/events";

export async function fileComplaintAction(formData: FormData) {
  const { session, student } = await requireParent();
  const body = String(formData.get("body") ?? "").trim();
  if (!body) redirect("/parent/complaint");
  await prisma.communication.create({ data: { studentId: student.id, userId: session.userId, type: "message", direction: "inbound", content: body, language: student.language, metadata: { kind: "complaint" } } });
  await emit({ type: "complaint.filed", stage: 2, studentId: student.id, actorType: "parent", actorId: session.userId, visibility: { P: true, C: true, CM: true, EM: true }, channels: { in_app: true, push: true }, payload: { preview: body.slice(0, 80) } });
  redirect("/parent?ok=complaint");
}
