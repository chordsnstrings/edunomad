import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { getMyStudent } from "@/lib/student";
import { emit } from "@/lib/events";
import { createVisaFile } from "@/lib/visa";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || session.role !== "student") return Response.json({ error: "unauthorized" }, { status: 401 });
  const student = await getMyStudent(session.userId);
  if (!student) return Response.json({ error: "no_student" }, { status: 404 });

  const { applicationId, decision } = (await req.json().catch(() => ({}))) as { applicationId?: string; decision?: "accept" | "decline" };
  if (!applicationId || !["accept", "decline"].includes(String(decision))) return Response.json({ error: "invalid" }, { status: 400 });

  const app = await prisma.application.findFirst({ where: { id: applicationId, studentId: student.id } });
  if (!app) return Response.json({ error: "not_found" }, { status: 404 });

  // There must actually be an offer to respond to. Without this a student could
  // "accept" a rejected or still-undecided application, which then opened a visa
  // file (below) for an offer that was never made.
  if (!app.decisionStatus?.startsWith("offer")) {
    return Response.json({ error: "no_offer" }, { status: 409 });
  }

  // Respond once: the conditional update also stops a double-tap re-deciding.
  const responded = await prisma.application.updateMany({
    where: { id: applicationId, decisionStatus: { startsWith: "offer" } },
    data: { decisionStatus: decision === "accept" ? "accepted" : "declined" },
  });
  if (responded.count !== 1) return Response.json({ error: "already_decided" }, { status: 409 });
  await emit({
    type: decision === "accept" ? "offer.accepted" : "offer.declined",
    stage: 6,
    studentId: student.id,
    applicationId,
    actorType: "student",
    actorId: session.userId,
    visibility: { S: true, C: true, O: true, OM: true, F: true },
    channels: { in_app: true, push: true },
    payload: {},
  });

  // Accepting an offer opens the visa file (Stage 8).
  if (decision === "accept") await createVisaFile(applicationId);
  return Response.json({ ok: true });
}
