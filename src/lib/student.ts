import { prisma } from "./db";

export const PROFILE_SECTIONS = [
  "academic",
  "englishProficiency",
  "destinations",
  "fieldOfStudy",
  "budgetMaxUsd",
  "intakeTarget",
] as const;

/** Fields the profile builder is allowed to write. */
export const PROFILE_WRITABLE = [
  "fullName",
  "dateOfBirth",
  "academic",
  "englishProficiency",
  "destinations",
  "fieldOfStudy",
  "fieldCategory",
  "budgetMinUsd",
  "budgetMaxUsd",
  "fundingSource",
  "intakeTarget",
] as const;

function filled(v: unknown): boolean {
  if (v == null) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.keys(v as object).length > 0;
  if (typeof v === "string") return v.trim().length > 0;
  return true;
}

/** Completeness % from the 6 profile sections (100% when all present). */
export function computeCompleteness(s: Record<string, unknown>): number {
  const done = PROFILE_SECTIONS.filter((k) => filled(s[k])).length;
  return Math.round((done / PROFILE_SECTIONS.length) * 100);
}

export async function getMyStudent(userId: string) {
  return prisma.student.findFirst({ where: { userId } });
}
