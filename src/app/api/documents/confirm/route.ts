import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { getMyStudent } from "@/lib/student";
import { runDocQa } from "@/lib/doc-qa";
import { emit } from "@/lib/events";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || session.role !== "student") return Response.json({ error: "unauthorized" }, { status: 401 });
  const student = await getMyStudent(session.userId);
  if (!student) return Response.json({ error: "no_student" }, { status: 404 });

  const { documentType, storageKey, mimeType, sizeBytes, amountCad } = (await req.json().catch(() => ({}))) as {
    documentType?: string;
    storageKey?: string;
    mimeType?: string;
    sizeBytes?: number;
    amountCad?: number;
  };
  if (!documentType || !storageKey) return Response.json({ error: "missing" }, { status: 400 });

  // Versioning: a re-upload creates a new version; old versions are retained.
  // An approved document is final and cannot be replaced (CLAUDE.md §4).
  const latest = await prisma.document.findFirst({ where: { studentId: student.id, documentType }, orderBy: { version: "desc" } });
  if (latest?.status === "approved") {
    return Response.json({ error: "already_approved" }, { status: 409 });
  }
  const prev = latest?.version ?? 0;
  const qa = runDocQa({ fullName: student.fullName }, sizeBytes ?? 0);

  // G078 — GIC certificate: validate name (via runDocQa) + amount threshold.
  let gicFlagged = false;
  if (documentType === "gic_certificate") {
    const GIC_THRESHOLD_CAD = 22895;
    const amt = Number(amountCad ?? 0);
    const amountOk = amt >= GIC_THRESHOLD_CAD;
    (qa.results as Record<string, unknown>).gic = { amount_at_or_above_threshold: { pass: amountOk, amount: amt, threshold: GIC_THRESHOLD_CAD } };
    gicFlagged = !amountOk;
  }

  const doc = await prisma.document.create({
    data: {
      studentId: student.id,
      documentType,
      version: prev + 1,
      storageKey,
      mimeType: mimeType ?? "application/octet-stream",
      sizeBytes: sizeBytes ?? 0,
      status: "under_review",
      qaResults: qa.results as unknown as Prisma.InputJsonValue,
      uploadedBy: session.userId,
    },
  });

  await emit({
    type: "document.uploaded",
    stage: 4,
    studentId: student.id,
    actorType: "student",
    actorId: session.userId,
    visibility: { S: true, C: true, O: true },
    channels: { in_app: true },
    payload: { documentType, version: doc.version, flagged: qa.flagged || gicFlagged },
  });
  return Response.json({ ok: true, flagged: qa.flagged });
}
