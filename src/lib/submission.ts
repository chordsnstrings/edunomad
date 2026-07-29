import { prisma } from "./db";
import { emit, withEvents } from "./events";

/** Sentinel: the application was already submitted, so the transaction rolls back. */
class AlreadySubmittedError extends Error {}

export async function packageApplication(applicationId: string, documentIds: string[]) {
  const app = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!app) return { ok: false as const };
  await prisma.applicationDocument.deleteMany({ where: { applicationId } });
  for (const documentId of documentIds) {
    const doc = await prisma.document.findUnique({ where: { id: documentId }, select: { documentType: true } });
    await prisma.applicationDocument.create({ data: { applicationId, documentId, roleInApp: doc?.documentType ?? "document" } });
  }
  // Only move forward. Re-packaging a submitted or decided application used to
  // rewind submissionStatus to "packaged", erasing a recorded offer.
  await prisma.application.updateMany({
    where: { id: applicationId, submissionStatus: { in: ["not_submitted", "packaged"] } },
    data: { submissionStatus: "packaged" },
  });
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
  // Submit-once, and atomically with its event: without the status predicate a
  // double-click submitted twice, and without the transaction a failure between
  // the two writes left an application marked submitted with no event recorded.
  await withEvents(async (tx) => {
    const moved = await tx.application.updateMany({
      where: { id: applicationId, submissionStatus: { not: "submitted" } },
      data: { submissionStatus: "submitted", submissionMethod: method, referenceId, submittedAt: new Date(), submissionProof: proof as object },
    });
    if (moved.count !== 1) throw new AlreadySubmittedError();
    await emit(
      {
        type: "application.submitted",
        stage: 5,
        studentId: app.studentId,
        applicationId,
        actorType: "ops",
        actorId: actorUserId,
        visibility: { S: true, C: true, O: true, OM: true },
        channels: { in_app: true, push: true },
        payload: { method, referenceId },
      },
      tx,
    );
  }).catch((e) => {
    if (e instanceof AlreadySubmittedError) return null;
    throw e;
  });
  return { ok: true as const, referenceId };
}
