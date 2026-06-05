# Data model

> Full data model. Mirrors CLAUDE.md Section 4 with more detail per
> entity. Source of truth for any goal that touches the database.

## Multi-tenancy

Every business-data entity carries `tenant_id`. Default scope on every
query is the user's tenant. Cross-tenant access requires explicit
allow and an audit log entry.

```
User
  id              uuid PK
  tenant          enum  [edunomad, student, agency, service_partner]
  tenant_id       uuid  (refs the tenant org / student / agency / partner)
  role            enum  (22 roles; see CLAUDE.md §6)
  phone           string (E.164)
  email           string nullable
  language        enum  [en, bn, hi, ne]
  status          enum  [active, deactivated, archived]
  created_at      timestamp
  deactivated_at  timestamp nullable
  archived_at     timestamp nullable
```

## Student

```
Student
  id                       uuid PK
  user_id                  uuid FK -> User (1:1)
  tenant_id                uuid (== self for student tenant)
  full_name                string (matches passport)
  phone                    string (E.164)
  email                    string nullable
  language                 enum [en, bn, hi, ne]
  source_country           enum [BD, IN, NP]
  source_attribution       jsonb  # UTM, referral_code, fair_qr_token
  date_of_birth            date nullable
  gender                   enum nullable
  academic                 jsonb  # qualification, board, percentage, year
  english_proficiency      jsonb  # type, score, evidence
  destinations             jsonb  # ranked array of [CA, UK, AU, MY]
  field_of_study           string
  budget_annual_usd        int
  funding_source           string
  intake_target            jsonb  # {month, year, flexibility}
  completeness_pct         int    # computed from filled fields
  assigned_counsellor_id   uuid FK -> User nullable
  lead_score               int    # computed
  parent_invite_id         uuid FK -> ParentInvite nullable
  created_at               timestamp
  updated_at               timestamp
```

## Application

```
Application
  id                uuid PK
  student_id        uuid FK -> Student
  programme_id      uuid FK -> Programme
  institution_id    uuid FK -> Institution
  shortlist_status  enum [draft, locked, withdrawn]
  intake            jsonb  # {month, year}
  submission_status enum [not_submitted, packaged, submitted, acknowledged,
                          under_review, info_requested, offer_conditional,
                          offer_unconditional, rejected, withdrawn]
  submission_method enum [email, portal, api]
  reference_id      string  # auto-embedded in subject for Tier 1 reply matching
  submitted_at      timestamp nullable
  decision_at       timestamp nullable
  offer_url         string nullable
  conditions        jsonb nullable
  rationale         text  # captured at shortlist time
  visa_file_id      uuid FK -> VisaFile nullable
  created_at        timestamp
  updated_at        timestamp
```

## Programme

```
Programme
  id                              uuid PK
  institution_id                  uuid FK -> Institution
  name                            string
  degree_level                    enum [foundation, diploma, bachelor, master, phd]
  field_category                  enum
  duration_months                 int
  tuition_per_year_usd            int
  intake_months_supported         array<int>
  english_min_specific_ielts      decimal nullable
  english_min_specific_duolingo   int nullable
  min_academic_percentage         decimal nullable
  active                          boolean
  notes                           text
```

## Institution

```
Institution
  id                       uuid PK
  name                     string
  country                  enum [CA, UK, AU, MY]
  city                     string
  tier                     int (1-4)
  tuition_min_usd          int
  tuition_max_usd          int
  intake_months            array<int>
  english_min_ielts        decimal
  english_min_duolingo     int
  english_min_pte          int
  accepts_moi_letter       boolean
  post_study_work_years    int
  scholarship_available    boolean
  dli_or_equivalent_id     string  # DLI / CRICOS / sponsor licence
  submission_tier          int (1, 2, or 3)
  admissions_email         string nullable
  portal_url               string nullable
  commission_rate_min_pct  decimal
  commission_rate_max_pct  decimal
  payment_terms_days       int
  active                   boolean
  notes                    text
```

## Document

```
Document
  id              uuid PK
  student_id      uuid FK -> Student
  document_type   string  # e.g. "passport_bio_page", "imm_1294"
  version         int     # incremented on re-upload
  storage_key     string  # object storage path
  mime_type       string
  size_bytes      int
  status          enum [uploaded, under_review, approved, rework_requested, rejected]
  qa_results      jsonb   # map of check_name -> {pass: bool, note: string}
  rework_reason   string nullable
  uploaded_by     uuid FK -> User
  reviewed_by     uuid FK -> User nullable
  reviewed_at     timestamp nullable
  created_at      timestamp

ApplicationDocument  # M2M: one doc can satisfy multiple applications
  application_id  uuid FK -> Application
  document_id     uuid FK -> Document
  role_in_app     string  # e.g. "transcript", "english_test_report"
  PRIMARY KEY (application_id, document_id, role_in_app)
```

## VisaFile

```
VisaFile
  id                       uuid PK
  application_id           uuid FK -> Application (1:1)
  destination_country      enum [CA, UK, AU, MY]
  checklist_state          jsonb  # per-item completion status
  completeness_pct         int
  prep_started_at          timestamp
  ready_for_signoff_at     timestamp nullable
  signed_off_at            timestamp nullable
  signed_off_by            uuid FK -> User (compliance role) nullable
  registration_number      string nullable  # RCIC/MARA/OISC number stamped
  version_hash             string nullable
  submitted_at             timestamp nullable
  submission_proof         jsonb nullable
  decision_status          enum [pending, approved, refused, info_requested]
  decision_at              timestamp nullable
  refusal_reasons          jsonb nullable
```

## ServiceBooking

```
ServiceBooking
  id                       uuid PK
  student_id               uuid FK -> Student
  service_partner_id       uuid FK -> ServicePartner
  service_type             enum [housing, bank, sim, insurance, transport, test_prep]
  status                   enum [requested, confirmed, in_progress, completed, cancelled]
  details                  jsonb
  created_at               timestamp
```

## Communication

```
Communication
  id                  uuid PK
  student_id          uuid FK -> Student
  user_id             uuid FK -> User (counsellor / ops / etc.)
  type                enum [call, message, whatsapp, email]
  direction           enum [inbound, outbound]
  content             text
  transcript          text nullable  # for calls
  language            enum
  metadata            jsonb  # template_id used, attachments, etc.
  created_at          timestamp
```

## Commission

```
Commission
  id                  uuid PK
  application_id      uuid FK -> Application
  institution_id      uuid FK -> Institution
  amount_local        decimal
  currency            string
  amount_usd          decimal
  status              enum [pending, claimable, claimed, paid_out, disputed]
  payout_id           uuid FK -> Payout nullable
  created_at          timestamp
```

## Payment & Invoice

```
Invoice
  id                  uuid PK
  student_id          uuid FK -> Student
  amount_local        decimal
  currency            string
  amount_usd          decimal
  purpose             string  # service_fee, tuition_deposit, gic_referral, etc.
  due_date            date
  status              enum [issued, paid, partially_paid, void, refunded]
  created_at          timestamp

Payment
  id                  uuid PK
  invoice_id          uuid FK -> Invoice
  amount_local        decimal
  currency            string
  method              enum [bkash, nagad, ssl, card, bank_transfer]
  external_ref        string
  status              enum [initiated, succeeded, failed, refunded]
  processed_at        timestamp
```

## Event

```
Event
  id              uuid PK
  type            enum  # full catalog in 02-events.md
  stage           int (1-9)
  student_id      uuid FK nullable
  application_id  uuid FK nullable
  actor_type      enum
  actor_id        uuid nullable
  visibility      jsonb  # {S: bool, P: bool, C: bool, ...}
  channels        jsonb  # {in_app: bool, push: bool, whatsapp: bool, email: bool}
  payload         jsonb
  created_at      timestamp
  chain_hash      text  # sha256(json(this event) || previous chain_hash)
```

## EventRead (mutable; not part of the chain)

```
EventRead
  user_id     uuid FK -> User
  event_id    uuid FK -> Event
  read_at     timestamp
  PRIMARY KEY (user_id, event_id)
```

## ParentInvite

```
ParentInvite
  id            uuid PK
  student_id    uuid FK -> Student
  parent_phone  string (E.164)
  status        enum [sent, accepted, expired]
  parent_user_id uuid FK -> User nullable  # set on acceptance
  sent_at       timestamp
  accepted_at   timestamp nullable
```

## AuditLog (separate from Event — broader scope)

```
AuditLog
  id              uuid PK
  actor_user_id   uuid FK -> User
  action          string  # e.g. "payment.approve", "visa_file.signed_off"
  target_type     string  # "VisaFile", "Payment", etc.
  target_id       uuid
  before_state    jsonb nullable
  after_state     jsonb nullable
  ip_address      string
  user_agent      string
  result          enum [success, denied, failed]
  reason          string nullable  # set when denied
  created_at      timestamp
  chain_hash      text  # same hash-chaining as Event
```

## Notes on indexes (pick your own; just don't skip the obvious)

- `Event.student_id, created_at` — activity feed
- `Event.application_id, created_at` — per-app timeline
- `Application.student_id, shortlist_status` — counsellor inbox
- `Document.student_id, document_type` — doc vault
- `User.tenant, tenant_id` — every multi-tenant query
- `AuditLog.actor_user_id, created_at` — auditor view
- `AuditLog.target_type, target_id` — per-target audit trail

## Soft-delete vs hard-delete

- **Users:** soft-deleted (`status = deactivated`). 90-day compliance hold;
  `status = archived` after.
- **Students:** never hard-deleted while a visa file is in flight.
- **Documents:** versioned; old versions retained.
- **Events:** never deleted, ever. Corrections are new events with type
  ending in `.corrected`.
