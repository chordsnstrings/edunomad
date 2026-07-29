"use server";

import { redirect } from "next/navigation";
import { requireParent } from "@/lib/parent";
import { emit } from "@/lib/events";
import { text, LIMITS } from "@/lib/form";

export async function escalateAction(formData: FormData) {
  const { session, student } = await requireParent();
  const reason = text(formData, "reason", LIMITS.longText);
  await emit({ type: "escalation.raised", stage: 2, studentId: student.id, actorType: "parent", actorId: session.userId, visibility: { P: true, C: true, CM: true, EM: true }, channels: { in_app: true, push: true }, payload: { reason } });
  redirect("/parent?ok=escalated");
}
