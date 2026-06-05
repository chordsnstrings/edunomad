"use server";

import { redirect } from "next/navigation";
import type { SubmissionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { emit } from "@/lib/events";

const MAP: Record<string, { status: SubmissionStatus; event: string }> = {
  acknowledged: { status: "acknowledged", event: "application.acknowledged" },
  under_review: { status: "under_review", event: "application.under_review" },
  info_requested: { status: "info_requested", event: "application.info_requested" },
  offer_conditional: { status: "offer_conditional", event: "offer.received" },
  offer_unconditional: { status: "offer_unconditional", event: "offer.received" },
  rejected: { status: "rejected", event: "application.rejected" },
};

export async function classifyAction(formData: FormData) {
  const s = await getCurrentSession();
  if (!s || !["operations_team", "operations_manager"].includes(s.role)) redirect("/operations/login");
  const emailId = String(formData.get("emailId"));
  const classification = String(formData.get("classification"));
  const m = MAP[classification];
  if (!m) redirect("/operations/replies");

  const email = await prisma.inboundEmail.findUnique({ where: { id: emailId } });
  await prisma.inboundEmail.update({ where: { id: emailId }, data: { classified: true, classification } });

  if (email?.applicationId) {
    const isOffer = classification.startsWith("offer");
    const app = await prisma.application.update({
      where: { id: email.applicationId },
      data: { submissionStatus: m.status, ...(isOffer ? { decisionStatus: classification, decisionAt: new Date() } : {}) },
    });
    await emit({
      type: m.event,
      stage: isOffer ? 6 : 5,
      studentId: app.studentId,
      applicationId: app.id,
      actorType: "ops",
      actorId: s.userId,
      visibility: { S: true, C: true, O: true, OM: true },
      channels: { in_app: true, push: isOffer, whatsapp: isOffer, email: isOffer },
      payload: { classification },
    });
  }
  redirect("/operations/replies");
}
