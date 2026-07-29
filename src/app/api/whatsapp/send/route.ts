import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { whatsappSend, renderWhatsAppBody } from "@/lib/whatsapp";
import { emit } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || !["counsellor", "counsellor_manager"].includes(session.role)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  const { studentId, templateId, variables } = (await req.json().catch(() => ({}))) as {
    studentId?: string;
    templateId?: string;
    variables?: string[];
  };
  if (!studentId || !templateId) return Response.json({ error: "missing" }, { status: 400 });

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return Response.json({ error: "not_found" }, { status: 404 });
  if (session.role === "counsellor" && student.assignedCounsellorId !== session.userId) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const vars = variables ?? [];
  let body: string;
  try {
    body = renderWhatsAppBody(templateId, vars);
  } catch {
    return Response.json({ error: "unknown_template" }, { status: 400 });
  }

  const result = await whatsappSend(templateId, vars, student.phone, { optedIn: true });
  await prisma.communication.create({
    data: {
      studentId,
      userId: session.userId,
      type: "whatsapp",
      direction: "outbound",
      content: body,
      language: student.language,
      // Record the ACTUAL delivery outcome. Storing only the channel meant a
      // failed send was indistinguishable from a delivered one, in both the
      // communication log and the immutable event that follows it.
      metadata: { templateId, channel: result.channel, delivered: result.ok },
    },
  });
  await emit({
    type: "counsellor.message_sent",
    stage: 2,
    studentId,
    actorType: "counsellor",
    actorId: session.userId,
    visibility: { S: true, C: true, CM: true },
    channels: { in_app: true, whatsapp: true },
    payload: { templateId, preview: body.slice(0, 80) },
  });
  return Response.json({ ok: result.ok, delivered: result.ok, channel: result.channel });
}
