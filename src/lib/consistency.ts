type DocLike = { documentType: string; qaResults?: unknown };

export type ConsistencyCheck = { field: string; consistent: boolean; note: string };

/** Cross-document consistency: name, DOB, legibility across the file (G081). */
export function crossDocConsistency(
  student: { fullName: string | null; dateOfBirth: Date | null },
  documents: DocLike[],
): { checks: ConsistencyCheck[]; consistent: boolean } {
  const nameFails = documents.filter((d) => {
    const qa = d.qaResults as { name_match?: { pass?: boolean } } | null;
    return qa?.name_match && qa.name_match.pass === false;
  });
  const unreadable = documents.filter((d) => {
    const qa = d.qaResults as { readable?: { pass?: boolean } } | null;
    return qa?.readable && qa.readable.pass === false;
  });

  const checks: ConsistencyCheck[] = [
    { field: "name", consistent: nameFails.length === 0, note: nameFails.length ? `${nameFails.length} document(s) failed name match` : "names consistent with passport" },
    { field: "date_of_birth", consistent: !!student.dateOfBirth, note: student.dateOfBirth ? "on file" : "missing from profile" },
    { field: "legibility", consistent: unreadable.length === 0, note: unreadable.length ? `${unreadable.length} document(s) illegible` : "all documents legible" },
  ];
  return { checks, consistent: checks.every((c) => c.consistent) };
}
