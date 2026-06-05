import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { emit } from "@/lib/events";
import { sendSms } from "@/lib/sms";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || !["counsellor", "counsellor_manager"].includes(session.role)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  const { studentId, text } = (await req.json().catch(() => ({}))) as { studentId?: string; text?: string };
  if (!studentId || !text) return Response.json({ error: "missing" }, { status: 400 });

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return Response.json({ error: "not_found" }, { status: 404 });
  if (session.role === "counsellor" && student.assignedCounsellorId !== session.userId) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.communication.create({
    data: { studentId, userId: session.userId, type: "whatsapp", direction: "outbound", content: text, language: student.language, metadata: { kind: "call_summary" } },
  });
  await emit({
    type: "counsellor.message_sent",
    stage: 2,
    studentId,
    actorType: "counsellor",
    actorId: session.userId,
    visibility: { S: true, C: true },
    channels: { in_app: true, whatsapp: true },
    payload: { kind: "call_summary", preview: text.slice(0, 80) },
  });
  try {
    await sendSms(student.phone, text);
  } catch {
    /* best-effort */
  }
  return Response.json({ ok: true });
}
