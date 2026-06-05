// Personalised document checklist (Canada reference set; other destinations use
// the same schema once Operations activates them). Source:
// docs/05-reference/document-checklist.md
export type ChecklistDoc = {
  documentType: string;
  label: string;
  stage: "profile" | "application" | "post_offer" | "visa_file" | "pre_departure";
  required: boolean;
  mastersOnly?: boolean;
  ageMin?: number;
  notes: { en: string; bn?: string; hi?: string; ne?: string };
};

export const CA_CHECKLIST: ChecklistDoc[] = [
  { documentType: "passport_bio_page", label: "Passport bio page", stage: "profile", required: true, notes: { en: "Clear scan of the photo page. Passport must be valid 6 months beyond your intended stay." } },
  { documentType: "hsc_or_12th_transcript", label: "HSC / 12th transcript", stage: "application", required: true, notes: { en: "Official marksheet for your higher-secondary results." } },
  { documentType: "hsc_or_12th_certificate", label: "HSC / 12th certificate", stage: "application", required: true, notes: { en: "Passing certificate from your board." } },
  { documentType: "bachelor_transcript", label: "Bachelor's transcript", stage: "application", required: true, mastersOnly: true, notes: { en: "Full transcript for masters applicants." } },
  { documentType: "bachelor_certificate", label: "Bachelor's certificate", stage: "application", required: true, mastersOnly: true, notes: { en: "Degree certificate for masters applicants." } },
  { documentType: "english_test_report", label: "English test / MOI", stage: "application", required: true, notes: { en: "IELTS / Duolingo / PTE report, or an MOI letter where accepted." } },
  { documentType: "sop_personal_statement", label: "Statement of purpose", stage: "application", required: true, notes: { en: "Your SOP. Your counsellor will help you polish it." } },
  { documentType: "reference_letters", label: "Reference letters", stage: "application", required: false, notes: { en: "Academic or professional references where required." } },
  { documentType: "tuition_deposit_receipt", label: "Tuition deposit receipt", stage: "post_offer", required: true, notes: { en: "Proof of your tuition deposit payment." } },
  { documentType: "letter_of_acceptance", label: "Letter of acceptance", stage: "post_offer", required: true, notes: { en: "Your LOA from the institution." } },
  { documentType: "gic_certificate", label: "GIC certificate", stage: "visa_file", required: true, notes: { en: "Issued by an approved Canadian financial institution; name must match your passport." } },
  { documentType: "financial_documents", label: "Financial documents", stage: "visa_file", required: true, notes: { en: "Sponsor bank statements, tax returns, payslips." } },
  { documentType: "sponsor_declaration", label: "Sponsor declaration", stage: "visa_file", required: true, notes: { en: "Signed declaration from your sponsor." } },
  { documentType: "imm_1294", label: "IMM 1294 (study permit)", stage: "visa_file", required: true, notes: { en: "Completed study permit application form." } },
  { documentType: "imm_5645_family_information", label: "IMM 5645 family information", stage: "visa_file", required: true, notes: { en: "Family information form." } },
  { documentType: "photographs", label: "Photographs", stage: "visa_file", required: true, notes: { en: "Per IRCC photo specification." } },
  { documentType: "police_certificate", label: "Police certificate", stage: "visa_file", required: true, ageMin: 18, notes: { en: "Required for applicants 18+, where requested." } },
  { documentType: "housing_confirmation", label: "Housing confirmation", stage: "pre_departure", required: false, notes: { en: "Proof of accommodation on arrival." } },
  { documentType: "flight_itinerary", label: "Flight itinerary", stage: "pre_departure", required: false, notes: { en: "Your travel booking." } },
  { documentType: "insurance_policy", label: "Insurance policy", stage: "pre_departure", required: false, notes: { en: "Health/travel insurance for your stay." } },
];

export const STAGE_LABELS: Record<string, string> = {
  profile: "Profile",
  application: "Application",
  post_offer: "After offer",
  visa_file: "Visa file",
  pre_departure: "Pre-departure",
};

export function generateChecklist(opts: { destination?: string; isMasters?: boolean; age?: number | null }): ChecklistDoc[] {
  return CA_CHECKLIST.filter(
    (d) => (!d.mastersOnly || opts.isMasters) && (d.ageMin == null || (opts.age != null && opts.age >= d.ageMin)),
  );
}
