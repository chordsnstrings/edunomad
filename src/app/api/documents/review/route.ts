import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { emit } from "@/lib/events";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || !["operations_team", "operations_manager"].includes(session.role)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  const { documentId, items, decision, reworkReason } = (await req.json().catch(() => ({}))) as {
    documentId?: string;
    items?: Record<string, boolean>;
    decision?: "approve" | "rework";
    reworkReason?: string;
  };
  if (!documentId || !["approve", "rework"].includes(String(decision))) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const doc = await prisma.document.findUnique({ where: { id: documentId } });
  if (!doc) return Response.json({ error: "not_found" }, { status: 404 });

  const status = decision === "approve" ? "approved" : "rework_requested";
  await prisma.document.update({
    where: { id: documentId },
    data: {
      status,
      reworkReason: decision === "rework" ? reworkReason ?? null : null,
      reviewedBy: session.userId,
      reviewedAt: new Date(),
      qaResults: { ...(doc.qaResults as object | null), rubric: items ?? {}, decision } as unknown as Prisma.InputJsonValue,
    },
  });

  await emit({
    type: decision === "approve" ? "document.approved" : "document.rework_requested",
    stage: 4,
    studentId: doc.studentId,
    actorType: "ops",
    actorId: session.userId,
    visibility: { S: true, C: true, O: true },
    channels: { in_app: true, ...(decision === "rework" ? { whatsapp: true } : {}) },
    payload: { documentType: doc.documentType, reworkReason: reworkReason ?? null },
  });
  return Response.json({ ok: true });
}
