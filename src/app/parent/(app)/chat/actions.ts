"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireParent } from "@/lib/parent";
import { translateText } from "@/lib/translate";
import { emit } from "@/lib/events";
import { text, LIMITS } from "@/lib/form";

export async function parentChatSendAction(formData: FormData) {
  const { session, student } = await requireParent();
  const content = text(formData, "content", LIMITS.longText);
  if (!content) redirect("/parent/chat");
  // Auto-translate the parent's message to English for the counsellor.
  const en = await translateText(content, "en");
  await prisma.communication.create({
    data: { studentId: student.id, userId: session.userId, type: "message", direction: "inbound", content, language: student.language, metadata: { kind: "parent_chat", en } as Prisma.InputJsonValue },
  });
  await emit({ type: "message.sent", stage: 2, studentId: student.id, actorType: "parent", actorId: session.userId, visibility: { P: true, C: true, CM: true }, channels: { in_app: true }, payload: { preview: content.slice(0, 80) } });
  redirect("/parent/chat");
}
