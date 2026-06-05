# Universities — seed data template

> Empty template. Team fills with real partner universities before launch.
> CSV form: `docs/05-reference/universities.csv` (Claude Code generates this
> from the schema below as part of W0 Foundations).

## Schema

| Field | Type | Notes |
|---|---|---|
| university_id | slug | Unique identifier, e.g. `uni_university_of_toronto` |
| name | string | Full name |
| country | enum | CA / UK / AU / MY |
| city | string | |
| tier | int 1–4 | Brand tier for portfolio fit |
| tuition_min_usd | int | Annual tuition lower bound |
| tuition_max_usd | int | |
| intake_months | comma list | e.g. `Jan,May,Sep` |
| english_min_ielts | decimal | |
| english_min_duolingo | int | |
| english_min_pte | int | |
| accepts_moi_letter | boolean | |
| post_study_work_years | int | |
| scholarship_available | boolean | |
| dli_or_equivalent_id | string | DLI / CRICOS / sponsor licence |
| submission_tier | int 1/2/3 | 1=email, 2=portal, 3=API |
| admissions_email | string | For Tier 1 |
| portal_url | url | For Tier 2 |
| commission_rate_min_pct | decimal | |
| commission_rate_max_pct | decimal | |
| payment_terms_days | int | |
| active | boolean | |
| notes | string | Free-form |

## Phase 1 size target

~30 universities × 8–15 programmes each = ~300–400 programme rows.

## Programmes schema

| Field | Type | Notes |
|---|---|---|
| programme_id | slug | |
| university_id | FK | References `universities.university_id` |
| name | string | |
| degree_level | enum | foundation / diploma / bachelor / master / phd |
| field_category | enum | business / engineering / IT / health / arts / science / hospitality / education / law / social_sciences |
| duration_months | int | |
| tuition_per_year_usd | int | |
| intake_months_supported | comma list | |
| english_min_specific_ielts | decimal | Optional override of university default |
| english_min_specific_duolingo | int | |
| min_academic_percentage | decimal | |
| active | boolean | |
| notes | string | |
