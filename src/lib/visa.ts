import { createHash } from "node:crypto";
import type { DestinationCountry, Document } from "@prisma/client";
import { prisma } from "./db";
import { emit } from "./events";
import { VISA_FORMS } from "./reference/visa-forms";

export function visaForms(destination: string) {
  return VISA_FORMS[destination] ?? VISA_FORMS.CA;
}

/** Auto-create a visa file for an accepted application (G073). */
export async function createVisaFile(applicationId: string) {
  const app = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!app) return null;
  const existing = await prisma.visaFile.findUnique({ where: { applicationId } });
  if (existing) return existing;
  const inst = await prisma.institution.findUnique({ where: { id: app.institutionId }, select: { country: true } });
  const destination = (inst?.country ?? "CA") as DestinationCountry;
  const vf = await prisma.visaFile.create({ data: { applicationId, studentId: app.studentId, destinationCountry: destination } });
  await emit({
    type: "visa.file_created",
    stage: 8,
    studentId: app.studentId,
    applicationId,
    actorType: "system",
    visibility: { S: true, C: true, O: true, OM: true, COMP: true },
    channels: { in_app: true },
    payload: { destination },
  });
  return vf;
}

/** Completeness from the student's uploaded documents matching required forms. */
export function visaCompleteness(destination: string, latest: Map<string, Document>) {
  const required = visaForms(destination).filter((f) => f.required);
  // Only an APPROVED document counts. Presence alone meant a rejected or
  // still-unreviewed upload pushed the file to 100%, and completeness is what
  // Compliance sees (and what the sign-off hash records) before signing.
  const done = required.filter((f) => latest.get(f.id)?.status === "approved").length;
  return required.length ? Math.round((done / required.length) * 100) : 0;
}

/** Deterministic content hash for stamping at sign-off. */
export function visaVersionHash(input: { completenessPct: number; formIds: string[]; updatedAt: Date }) {
  return createHash("sha256").update(JSON.stringify({ c: input.completenessPct, f: input.formIds.sort(), u: input.updatedAt.toISOString() })).digest("hex").slice(0, 32);
}
