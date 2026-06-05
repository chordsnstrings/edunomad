// First-pass document QA. The OCR engine is mocked behind this interface
// (swap in Tesseract.js / a textract service); legibility + name-match logic and
// the qa_results contract are real. Every item also queues for human QA (§G042).

export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  return d[m][n];
}

export type QaResults = {
  readable: { pass: boolean; confidence: number };
  name_match: { pass: boolean; note: string };
  human_qa_required: boolean;
};

/** Mock OCR extraction — replace with a real engine. Returns text + confidence. */
function ocrExtract(sizeBytes: number, fullName: string | null): { confidence: number; extractedName: string } {
  // Heuristic stand-in: very small files are likely unreadable.
  const confidence = sizeBytes > 20 * 1024 ? 0.85 : 0.4;
  return { confidence, extractedName: fullName ?? "" };
}

export function runDocQa(student: { fullName: string | null }, sizeBytes: number): { results: QaResults; flagged: boolean } {
  const { confidence, extractedName } = ocrExtract(sizeBytes, student.fullName);
  const readable = { pass: confidence > 0.7, confidence };

  let nameMatch = { pass: true, note: "no name on file to compare" };
  if (student.fullName) {
    const dist = levenshtein(extractedName.toLowerCase(), student.fullName.toLowerCase());
    nameMatch = { pass: dist <= 2, note: `levenshtein=${dist}` };
  }

  // Pass-through items still queue for human QA.
  const results: QaResults = { readable, name_match: nameMatch, human_qa_required: true };
  const flagged = !readable.pass || !nameMatch.pass;
  return { results, flagged };
}
