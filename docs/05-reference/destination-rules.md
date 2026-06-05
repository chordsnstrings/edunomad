# Destination rules

> Per-country regulatory rules. Maintained by Compliance via the
> regulatory bulletin workflow. Visa file builder, eligibility logic,
> and cost calculator all read from this.

## Canada

| Rule | Value |
|---|---|
| Visa authority | IRCC |
| Processing weeks (estimate) | 8–16 |
| Financial proof threshold | CAD 22,895 (effective 2025-09-01) |
| Method preferred | GIC |
| PAL required for undergraduate | Yes (effective 2024-01-22) |
| PAL required for graduate | No |
| Language tests accepted | IELTS, CELPIP, PTE, TEF, TCF |
| Typical IELTS minimum | 6.0 overall |
| Post-study work visa | Available, 1–3 years |
| SDS status | Ended 2024-11-08 |
| Visa fee (CAD) | 150 |
| Biometrics fee (CAD) | 85 |
| Current form versions | IMM 1294: 2024-11; IMM 5709: 2024-09; IMM 5645: 2023-04 |

**Note:** SDS ended Nov 8 2024 — all applications now go through regular stream; processing is longer; documentation must be more complete than under SDS. GIC remains strongly preferred over alternative financial proof.

## United Kingdom

| Rule | Value |
|---|---|
| Visa authority | UKVI |
| Processing weeks (estimate) | 3–6 |
| Financial proof outside London | GBP 1,334/month × 9 months = 12,006 |
| Financial proof London | GBP 1,909/month × 9 months = 17,196 |
| Method preferred | Bank balance held 28 consecutive days |
| Language tests accepted | IELTS UKVI, SELA, Language Cert, PTE Academic, Trinity |
| Typical IELTS minimum | 6.0 overall, components 5.5 |
| Post-study work visa | Graduate Route, 2–3 years |
| CAS required | Yes |
| IHS per year (GBP) | 776 |
| TB test required | Yes |
| Visa fee (GBP) | 490 |

**Note:** Funds must be in a bank account for 28 consecutive days; statement dated within 31 days of application.

## Australia

| Rule | Value |
|---|---|
| Visa authority | Department of Home Affairs |
| Processing weeks (estimate) | 4–16 |
| Financial proof threshold | AUD 29,710 (effective 2024-05-10) |
| Method preferred | Bank statements with evidence of source |
| Language tests accepted | IELTS, TOEFL, PTE, CAE, OET |
| Typical IELTS minimum | 6.0 overall, components 5.5 |
| Post-study work visa | Temporary Graduate 485, 2–4 years |
| CoE required | Yes |
| OSHC required | Yes |
| GTE statement required | Yes |
| Visa fee (AUD) | 1,600 |

**Note:** Genuine Temporary Entrant requirement is critical; SOP / GTE statement heavily scrutinised. OSHC required for entire visa duration.

## Malaysia

| Rule | Value |
|---|---|
| Visa authority | EMGS / Immigration |
| Processing weeks (estimate) | 4–8 |
| Financial proof threshold | MYR 12,000 |
| Method preferred | Bank statement or sponsor declaration |
| Language tests accepted | IELTS, TOEFL, PTE, MUET |
| Typical IELTS minimum | 5.5 overall |
| Post-study work visa | Limited |
| EMGS required | Yes |
| Medical exam required | Yes (pre and post arrival) |
| Insurance required | Yes |
| Student pass application | Required, attached on arrival |

**Note:** EMGS approval before visa. Medical exam pre-arrival; second post-arrival. Wide quality variance among institutions.

## Forms repository

Each destination has a forms repo entry per required form:
- `country` (CA / UK / AU / MY)
- `form_id` (e.g. imm_1294)
- `name`
- `current_version` (YYYY-MM)
- `regulator_url`
- `pdf_storage_key` (where the PDF lives in object storage)

When Compliance posts a regulatory bulletin marking a form as superseded, the system flags affected open visa files: "Form has been revised. Re-download and re-attach the new version."
