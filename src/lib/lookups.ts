import { prisma } from "./db";

/**
 * Batch lookup helpers.
 *
 * Queue/list screens need a display name or programme title for each row. Doing
 * that per row is an N+1 (a 200-row queue meant 200-400 round-trips). These
 * helpers fetch the whole set in one query and return a Map for O(1) joins in
 * memory. Always pass the full id list for the page.
 */

/** Display name (full name, falling back to phone) for each student id. */
export async function studentNames(ids: string[]): Promise<Map<string, string>> {
  const unique = [...new Set(ids)].filter(Boolean);
  if (unique.length === 0) return new Map();
  const students = await prisma.student.findMany({
    where: { id: { in: unique } },
    select: { id: true, fullName: true, phone: true },
  });
  return new Map(students.map((s) => [s.id, s.fullName ?? s.phone ?? ""]));
}

/** Programme (with its institution name) for each programme id. */
export async function programmesById(ids: string[]) {
  const unique = [...new Set(ids)].filter(Boolean);
  if (unique.length === 0) return new Map<string, Awaited<ReturnType<typeof fetchProgrammes>>[number]>();
  const programmes = await fetchProgrammes(unique);
  return new Map(programmes.map((p) => [p.id, p]));
}

function fetchProgrammes(ids: string[]) {
  return prisma.programme.findMany({
    where: { id: { in: ids } },
    include: { institution: { select: { name: true } } },
  });
}
