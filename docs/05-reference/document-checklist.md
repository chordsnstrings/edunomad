# Document checklist — per destination, per stage

## Stages
profile, application, post_offer, visa_file, pre_departure

## Schema (YAML form)

```yaml
- destination: CA
  stage: visa_file
  document_type: gic_certificate
  required: true
  format: [pdf]
  max_size_mb: 5
  notes_en: "Issued by approved Canadian financial institution. Must show student name matching passport."
  notes_bn: ""
  notes_hi: ""
  notes_ne: ""
  qa_checks:
    - name_matches_passport
    - amount_at_or_above_threshold
    - issued_within_validity
```

## Canada — full set

**Profile stage:**
- passport_bio_page

**Application stage:**
- hsc_or_12th_transcript
- hsc_or_12th_certificate
- bachelor_transcript (for masters)
- bachelor_certificate (for masters)
- english_test_report (IELTS / Duolingo / PTE / MOI letter)
- sop_personal_statement
- reference_letters

**Post-offer stage:**
- tuition_deposit_receipt
- letter_of_acceptance

**Visa file stage:**
- gic_certificate
- financial_documents (sponsor bank statements, tax returns, payslips)
- sponsor_declaration
- imm_1294
- imm_5709_schedule_1
- imm_5645_family_information
- photographs (per IRCC spec)
- medical_exam_results (where required)
- police_certificate (where required)
- translations (where applicable)

**Pre-departure stage:**
- housing_confirmation
- flight_itinerary
- insurance_policy

## UK / AU / MY templates

Same schema. Canada serves as reference example. Compliance/Operations
Manager fills these before activating those destinations.

## QA checks (machine-checkable)

| Check | Description | Method |
|---|---|---|
| readable | Document is legible | Auto + human |
| validity_6_months | Passport valid 6 months past intended stay | Auto |
| mrz_visible | Passport MRZ fully visible | Auto |
| name_matches_passport | Name matches passport exactly | OCR + human |
| name_consistent_across_documents | Name spelling consistent | Auto |
| dates_consistent_with_profile | Dates match profile timeline | Auto + human |
| all_pages_present | Multi-page doc complete | Human |
| amount_at_or_above_threshold | Financial threshold met | OCR + human |
| issued_within_validity | Issue date within window | Auto |
| latest_form_version | Form revision current | Auto vs destination_rules |
| signed_where_required | Signature present | Human |
| certified_translation | Translator stamp present | Human |
| meets_photo_spec | Photo dimensional spec met | Auto cropper + human |
