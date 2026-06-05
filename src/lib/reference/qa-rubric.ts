// 30-item document QA rubric. A shared core applies to every document type;
// type-specific items are appended where relevant.
export const QA_RUBRIC_CORE: string[] = [
  // Legibility
  "Whole document is in frame, no cropping",
  "Text is sharp and readable (no blur)",
  "No glare or shadow obscuring content",
  "Resolution sufficient to read fine print",
  "Colour/contrast adequate",
  // Identity
  "Full name matches passport spelling",
  "Date of birth consistent across documents",
  "Photo (if any) matches the applicant",
  "No signs of tampering or editing",
  // Validity & dates
  "Issue date present and plausible",
  "Expiry/validity within required window",
  "Document is the current/latest version",
  "Dates are internally consistent",
  // Completeness
  "All pages present (no missing pages)",
  "All required fields completed",
  "Signatures present where required",
  "Official stamp/seal present where required",
  "Reference/registration numbers visible",
  // Format
  "Accepted file format (PDF/JPG/PNG)",
  "Within the size limit",
  "Correct orientation",
  "Single document per file (not merged incorrectly)",
  // Consistency
  "Institution/board name matches records",
  "Programme/qualification matches application",
  "Amounts/figures match supporting docs",
  "Address consistent with other documents",
  // Compliance
  "No prohibited content or misrepresentation",
  "Translations attached where non-English",
  "Translator certification present (if translated)",
  "Meets destination-specific requirement notes",
];

export function rubricFor(_documentType: string): string[] {
  return QA_RUBRIC_CORE;
}
