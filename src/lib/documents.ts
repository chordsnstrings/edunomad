import type { Document } from "@prisma/client";
import { prisma } from "./db";
import { emit } from "./events";
import { generateChecklist, type ChecklistDoc } from "./reference/document-checklist";

function ageFrom(dob: Date | null): number | null {
  if (!dob) return null;
  return Math.floor((Date.now() - +new Date(dob)) / (365.25 * 24 * 3600 * 1000));
}

type StudentLike = {
  id: string;
  destinations?: unknown;
  dateOfBirth: Date | null;
};

/** Personalised checklist for a student (emits document_checklist.generated once). */
export async function getChecklistForStudent(student: StudentLike): Promise<ChecklistDoc[]> {
  const apps = await prisma.application.findMany({ where: { studentId: student.id }, select: { programmeId: true } });
  let isMasters = false;
  let destination = (student.destinations as string[] | null)?.[0] ?? "CA";
  if (apps.length) {
    const progs = await prisma.programme.findMany({ where: { id: { in: apps.map((a) => a.programmeId) } }, include: { institution: true } });
    isMasters = progs.some((p) => p.degreeLevel === "master" || p.degreeLevel === "phd");
    if (progs[0]) destination = progs[0].institution.country;
  }
  const checklist = generateChecklist({ destination, isMasters, age: ageFrom(student.dateOfBirth) });

  const already = await prisma.event.findFirst({ where: { studentId: student.id, type: "document_checklist.generated" } });
  if (!already) {
    await emit({
      type: "document_checklist.generated",
      stage: 4,
      studentId: student.id,
      actorType: "system",
      visibility: { S: true, C: true, O: true },
      channels: { in_app: true },
      payload: { count: checklist.length, destination, isMasters },
    });
  }
  return checklist;
}

/** Map of documentType → latest version document for a student. */
export async function getLatestDocuments(studentId: string): Promise<Map<string, Document>> {
  const docs = await prisma.document.findMany({ where: { studentId }, orderBy: { version: "desc" } });
  const byType = new Map<string, Document>();
  for (const d of docs) if (!byType.has(d.documentType)) byType.set(d.documentType, d);
  return byType;
}
