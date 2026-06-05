import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { emit } from "@/lib/events";

export const dynamic = "force-dynamic";

const OUTCOMES = ["warm", "cold", "qualified", "hot"];

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || !["counsellor", "counsellor_manager"].includes(session.role)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  const { studentId, transcript, notes, outcomeTag, durationSec } = (await req.json().catch(() => ({}))) as {
    studentId?: string;
    transcript?: string;
    notes?: string;
    outcomeTag?: string;
    durationSec?: number;
  };
  if (!studentId || !OUTCOMES.includes(String(outcomeTag))) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return Response.json({ error: "not_found" }, { status: 404 });
  if (session.role === "counsellor" && student.assignedCounsellorId !== session.userId) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.communication.create({
    data: {
      studentId,
      userId: session.userId,
      type: "call",
      direction: "outbound",
      content: notes ?? "",
      transcript: transcript ?? null,
      language: student.language,
      metadata: { outcomeTag, durationSec: durationSec ?? 0 },
    },
  });
  await emit({
    type: "counsellor.call_completed",
    stage: 2,
    studentId,
    actorType: "counsellor",
    actorId: session.userId,
    visibility: { C: true, CM: true },
    channels: { in_app: true },
    payload: { outcomeTag, durationSec: durationSec ?? 0 },
  });
  return Response.json({ ok: true });
}
