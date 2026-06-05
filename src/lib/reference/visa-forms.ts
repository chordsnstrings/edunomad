// Per-destination visa forms with current regulator versions (Forms repository).
// Compliance/Operations update versions via the regulatory-updates flow (G079).
export type VisaForm = { id: string; label: string; version: string; required: boolean; url?: string };

export const VISA_FORMS: Record<string, VisaForm[]> = {
  CA: [
    { id: "imm_1294", label: "IMM 1294 — Application for Study Permit", version: "2024-10", required: true, url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/imm1294.html" },
    { id: "imm_5645_family_information", label: "IMM 5645 — Family Information", version: "2024-06", required: true, url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/imm5645.html" },
    { id: "gic_certificate", label: "GIC certificate", version: "current", required: true },
    { id: "financial_documents", label: "Financial documents", version: "current", required: true },
    { id: "sponsor_declaration", label: "Sponsor declaration", version: "current", required: true },
    { id: "photographs", label: "Photographs (IRCC spec)", version: "current", required: true },
    { id: "police_certificate", label: "Police certificate", version: "current", required: false },
  ],
  UK: [
    { id: "visa_application_form", label: "Student visa application form", version: "current", required: true },
    { id: "cas_statement", label: "CAS statement", version: "current", required: true },
    { id: "financial_documents", label: "Financial documents (28-day rule)", version: "current", required: true },
    { id: "tb_test", label: "Tuberculosis test certificate", version: "current", required: true },
  ],
  AU: [
    { id: "coe", label: "Confirmation of Enrolment (CoE)", version: "current", required: true },
    { id: "gte_statement", label: "Genuine Temporary Entrant statement", version: "current", required: true },
    { id: "oshc", label: "OSHC policy", version: "current", required: true },
    { id: "financial_documents", label: "Financial capacity evidence", version: "current", required: true },
  ],
  MY: [
    { id: "evisa_application", label: "EMGS eVAL application", version: "current", required: true },
    { id: "offer_letter", label: "Offer letter", version: "current", required: true },
    { id: "health_examination", label: "Health examination report", version: "current", required: true },
  ],
};
