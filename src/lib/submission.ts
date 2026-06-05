import { prisma } from "./db";
import { emit } from "./events";

export async function packageApplication(applicationId: string, documentIds: string[]) {
  const app = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!app) return { ok: false as const };
  await prisma.applicationDocument.deleteMany({ where: { applicationId } });
  for (const documentId of documentIds) {
    const doc = await prisma.document.findUnique({ where: { id: documentId }, select: { documentType: true } });
    await prisma.applicationDocument.create({ data: { applicationId, documentId, roleInApp: doc?.documentType ?? "document" } });
  }
  await prisma.application.update({ where: { id: applicationId }, data: { submissionStatus: "packaged" } });
  return { ok: true as const };
}

/** Submit an application (proof required — submission proof gate, G062). */
export async function submitApplication(
  applicationId: string,
  method: string,
  proof: Record<string, unknown> | null,
  actorUserId: string,
) {
  const app = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!app) return { ok: false as const, error: "not_found" };
  if (!proof || Object.keys(proof).length === 0) return { ok: false as const, error: "proof_required" };

  const referenceId = app.referenceId ?? `EN-${applicationId.slice(0, 8).toUpperCase()}`;
  await prisma.application.update({
    where: { id: applicationId },
    data: { submissionStatus: "submitted", submissionMethod: method, referenceId, submittedAt: new Date(), submissionProof: proof as object },
  });
  await emit({
    type: "application.submitted",
    stage: 5,
    studentId: app.studentId,
    applicationId,
    actorType: "ops",
    actorId: actorUserId,
    visibility: { S: true, C: true, O: true, OM: true },
    channels: { in_app: true, push: true },
    payload: { method, referenceId },
  });
  return { ok: true as const, referenceId };
}
