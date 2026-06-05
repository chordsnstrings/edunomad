# EduNomad — Claude Code Standing Orders

> This file is loaded by Claude Code on every session. It's the constitution
> for this build. Read it once per session; refer back when in doubt.
>
> If anything in this file conflicts with a goal file in `goals/`, the goal
> file is more specific and wins for that task. If anything conflicts with
> a regulatory rule in `docs/05-reference/destination-rules.md`, regulation
> wins. Never override regulation with engineering convenience.

---

## 0. What you are building

EduNomad is a Progressive Web App (PWA) that helps students from Bangladesh,
India, and Nepal apply to universities in Canada, the UK, Australia, and
Malaysia, and complete the full journey through visa approval and arrival.

**Phase 1 scope (this build):** Bangladesh source → Canada destination MVP.
Other corridors are deferred but the architecture must support adding source
markets and destinations as configuration, not redesign.

**Your job:** work through the goals in `goals/` in dependency order. Each
goal has acceptance criteria. Build, verify against criteria, mark done,
commit, move on. Use `/goals next` to pick the next unblocked goal.

---

## 1. Non-negotiable constraints

These override any engineering preference. If a goal seems to require
violating one of these, stop and escalate via `/blocker`.

1. **PWA only.** No native apps. Installable to home screen on iOS and Android.
2. **Mobile-first.** Primary breakpoint at 380px. Desktop is secondary.
3. **Postgres** (or another SQL store with strong relational guarantees).
   Audit trail and event sourcing require relational integrity.
4. **4 UI languages from day one:** English, Bangla, Hindi, Nepali. ICU
   message format. i18n built in, not retrofitted. Every visible string
   is keyed; never hard-code strings.
5. **Audit log:** append-only, immutable, hash-chained. 6-year retention.
   Never delete events. Never edit events. Corrections are new events.
6. **Event-sourced status.** Application status, document status, journey
   stage are derived from the event stream, never stored as state separate
   from events.
7. **WhatsApp Cloud API integration:** plumbing in place to swap in when
   credentials are provided. Until then, SMS via Twilio as fallback.
   Do not block other work on WhatsApp; mock the interface.
8. **Phone OTP primary auth.** Email is secondary.
9. **Multi-tenant from day one:** four tenants (EduNomad internal,
   Student-side, Agency, Service Partner). Every business-data entity
   carries `tenant_id`.
10. **RBAC enforced server-side** on every action. UI hints from the same
    source but never trusted as a permission boundary. Deny by default.
11. **No off-platform money flows.** Every student/parent payment goes
    through platform payment integrations.
12. **Compliance has refusal authority on visa files.** No code path lets
    anyone other than a user with the `compliance` role sign off a visa
    file. No business pressure overrides this.

---

## 2. Conventions you choose, but stay consistent

You pick the framework, libraries, ORM, validation, auth library, file
structure. The constraints above are the only places we override your
judgement. But once you pick, stay consistent: don't mix three validation
libraries; don't introduce a new ORM after the first 10 goals.

Document your picks in `docs/00-stack-decisions.md` as you make them.
Update on change. This file is your decision log.

---

## 3. Working rhythm

For each goal:

1. Read the goal file in `goals/G###-*.md`.
2. Read every doc it references under `## References`.
3. Propose a plan (touched files, new files, schema changes). For non-trivial
   goals, share the plan before writing code.
4. Build to the acceptance criteria. No more, no less.
5. Run `/verify` against each criterion.
6. If all pass: mark done in `goals/_index.json`, commit with the goal id
   in the message, move to the next goal.
7. If any fail: either fix or `/blocker` with what's missing.

**Out of scope is real.** Each goal has an `## Out of scope` section.
Honour it. Don't gold-plate. Other goals will pick up adjacent work.

**Commit per goal.** One commit per completed goal, message format:
`G023: Counsellor lead inbox with SOP right rail`. This makes history
debuggable.

---

## 4. The data model

Nine core entities plus the events table. The events table is the source of
truth for status; everything else derives from it.

### Core entities

| Entity | Purpose | Key relations |
|---|---|---|
| Student | The customer | → many Applications; → many Documents; → many ParentInvites; → many Payments; → many Notes |
| Application | One application to one Programme | → Student, Programme, Institution, VisaFile (1:1 when visa stage reached); → many Events |
| Programme | An offered course | → Institution; → many Applications |
| Institution | A university or college | → many Programmes; → many Applications |
| Document | An uploaded document | → Student; → many ApplicationDocuments |
| VisaFile | The visa application packet | → Application (1:1); → many Documents; → many ComplianceSignOffs |
| ServiceBooking | Housing, bank, SIM, insurance, transport, test prep | → Student; → ServicePartner |
| Communication | Calls, messages, WhatsApp threads, emails | → Student; → User |
| Commission | University commission earned by EduNomad | → Application; → Institution; → Payouts |
| Event | Every meaningful change | → Student; → Application (nullable); typed |

### Multi-tenancy

Every business-data entity carries `tenant_id`. Cross-tenant queries are
guarded; default scope is the user's tenant.

```
User
  ├─ tenant: edunomad | student | agency | service_partner
  ├─ tenant_id: uuid
  └─ role: enum (see Section 6)
```

### Events table — the spine

```
Event
  ├─ id: uuid
  ├─ type: enum (full catalog in docs/02-events.md)
  ├─ stage: int (1-9; see Section 5)
  ├─ student_id: uuid
  ├─ application_id: uuid (nullable)
  ├─ actor_type: enum (student, parent, counsellor, ops, ops_manager,
  │                    counsellor_manager, compliance, finance,
  │                    education_manager, super_admin, system, university)
  ├─ actor_id: uuid (nullable for system events)
  ├─ visibility: jsonb     # {S: true, P: true, C: true, ...}
  ├─ channels: jsonb       # {in_app: true, push: true, whatsapp: false, email: false}
  ├─ payload: jsonb        # event-type-specific structured data
  ├─ created_at: timestamp
  └─ chain_hash: text      # hash of (this event JSON || previous chain_hash)
```

### Append-only and hash-chained

- No edits to events. No deletes.
- To correct a mistaken event, emit a new event of type `*.corrected`
  with the correction in the payload.
- Every event's `chain_hash` binds it to the previous event. Tampering
  breaks the chain and is detected on audit export.
- Read-state (which events a user has seen) is in a separate table —
  that table is mutable; events themselves are not.

### Document storage

- Document binary in object storage (S3-compatible). Database holds metadata
  + signed URL generation only.
- Documents have status derived from events: requested → uploaded →
  under_review → approved | rework_requested | rejected.
- Documents have versions. A re-upload creates a new version; old versions
  retained. Submitted documents cannot be edited.

### Soft-delete vs hard-delete

- Users are soft-deleted (deactivated). 90-day compliance hold; archived after.
- Students are never hard-deleted while a visa file is in flight
  (regulatory retention).
- Documents are versioned, not deleted.
- Events are never deleted, ever.

---

## 5. The 9 journey stages

| Stage | Name |
|---|---|
| 1 | Profile & Eligibility |
| 2 | Counsellor Onboarding |
| 3 | Shortlist |
| 4 | Application Prep |
| 5 | Application Submitted |
| 6 | University Decision |
| 7 | Tuition & GIC |
| 8 | Visa |
| 9 | Pre-Departure & Arrival |

Every event belongs to one stage. Status timelines are derived per stage.

---

## 6. The 22 roles (10 active in Phase 1)

Phase 1 builds 10 roles fully. Agency and Service Partner roles are deferred
but the data model accommodates them; do not build their UIs yet.

### Active in Phase 1

| Role | Tenant | Purpose |
|---|---|---|
| Super Admin | edunomad | Platform admin: provisioning, RBAC, audit logs, integrations, security |
| Education Manager | edunomad | Vertical P&L; oversight; exception approvals |
| Counsellor Manager | edunomad | Manages counsellor team; lead routing; QA; performance |
| Counsellor | edunomad | Primary student relationship; qualification; shortlisting; parent mgmt |
| Operations Manager | edunomad | Manages Operations team; SOP standards; visa file pre-Compliance audit |
| Operations Team | edunomad | Doc QA; SOP polish; packaging; visa file prep; submission |
| Compliance (RCIC/MARA) | edunomad | Sole legal sign-off authority on visa files; regulatory currency |
| Finance / Accounts | edunomad | Inbound payments, commissions, payouts, refunds, multi-currency |
| Student | student | The customer. Profile, applications, documents, payments, services |
| Parent / Sponsor | student | Visibility, financial approval. Read-mostly. Default locale = source-country language |

### Deferred to Phase 2

Agency Owner, Agency Sub-Counsellor (agency tenant); Housing Partner, Bank
Partner, Insurance Partner, Transport Partner, SIM Partner, Test Prep
Partner (service_partner tenant); Pre-Departure Coord, Marketing, BD
Manager, Alumni (build data model, defer UIs).

### Scope shorthand for permissions

- `own` — records the user owns / is subject of
- `own_assigned` — records explicitly assigned to this user
- `own_team` — records owned by users this user manages
- `own_invited_to` — records the user has been invited to view (parent → student)
- `own_assigned_pre_lock` — assigned records still in editable pre-lock state
- `all` — unrestricted within the user's tenant

### Full RBAC matrix

#### Super Admin
```
user:                {view: all, create: all, edit: all, delete: all}
role_assignment:     {view: all, create: all, edit: all, delete: all}
audit_log:           {view: all}  # read-only by design
integration_config:  {view: all, create: all, edit: all, delete: all}
backup:              {view: all, create: all, edit: all}
data_export:         {view: all, create: all}
student:             {view: all}  # read-only; never edits business data
application:         {view: all}
visa_file:           {view: all}
payment:             {view: all}
```

#### Education Manager
```
student:               {view: all}
application:           {view: all}
visa_file:             {view: all}
counsellor:            {view: own_team}
operations_member:     {view: own_team}
kpi_dashboard:         {view: all}
partner_university:    {view: all, approve: true}
financial_summary:     {view: all}
exception_approval:    {view: all, approve: true}
sop:                   {view: all, edit: own_assigned, approve: true}
escalation:            {view: all, approve: true}
```

#### Counsellor Manager
```
student:           {view: own_team, edit: own_team}
application:       {view: own_team}
counsellor:        {view: own_team, edit: own_team}
lead_routing:      {view: own_team, create: own_team, edit: own_team, approve: true}
qa_review:         {view: own_team, create: own_team, edit: own_team, approve: true}
escalation:        {view: own_team, edit: own_team, approve: true}
refund_request:    {view: own_team, edit: own_team, approve: true}
```

#### Counsellor
```
student:        {view: own_assigned, edit: own_assigned}
application:    {view: own_assigned, edit: own_assigned_pre_lock}
shortlist:      {view: own_assigned, create: own_assigned, edit: own_assigned_pre_lock,
                 delete: own_assigned_pre_lock}
document:       {view: own_assigned}
sop_draft:      {view: own_assigned, edit: own_assigned_pre_lock}
message:        {view: own_assigned, create: own_assigned}
call:           {view: own_assigned, create: own_assigned}
note:           {view: own_assigned, create: own_assigned, edit: own_assigned}
escalation:     {view: own_assigned, create: own_assigned}
```

#### Operations Manager
```
student:             {view: all}
application:         {view: all, edit: own_team, approve: true}
visa_file:           {view: all, edit: own_team, approve: true}
operations_member:   {view: own_team, edit: own_team}
template:            {view: all, edit: all, approve: true}
checklist:           {view: all, edit: all, approve: true}
partner_uni_sla:     {view: all, edit: all}
```

#### Operations Team
```
student:        {view: own_assigned}
application:    {view: own_assigned, edit: own_assigned}
visa_file:      {view: own_assigned, create: own_assigned, edit: own_assigned}
document:       {view: own_assigned, edit: own_assigned, approve: true}
sop_polish:     {view: own_assigned, edit: own_assigned}
submission:     {view: own_assigned, create: own_assigned}
```

#### Compliance (RCIC/MARA)
```
visa_file:                {view: all, approve: true}  # sole sign-off authority
audit_log:                {view: all}
regulatory_bulletin:      {view: all, create: all, edit: own_assigned}
misrepresentation_flag:   {view: all, create: all, edit: own_assigned, approve: true}
regulator_notification:   {view: own_assigned, create: own_assigned,
                           edit: own_assigned}
training_log:             {view: all}
```

#### Finance
```
payment:            {view: all, create: all, edit: own_assigned, approve: true}
invoice:            {view: all, create: all, edit: own_assigned}
commission:         {view: all, create: all, edit: own_assigned, approve: true}
payout:             {view: all, create: all, edit: own_assigned, approve: true}
refund:             {view: all, edit: own_assigned, approve: true}
financial_report:   {view: all, create: all}
student:            {view: all}
```

#### Student
```
student_self:   {view: own, edit: own, delete: own}
profile:        {view: own, create: own, edit: own}
application:    {view: own, approve: true}  # accept/decline offers
shortlist:      {view: own, create: own, edit: own_pre_lock, delete: own_pre_lock,
                 approve: own}  # lock action
document:       {view: own, create: own}
sop_draft:      {view: own, create: own, edit: own_pre_lock, approve: own}
payment:        {view: own, create: own, approve: own}
message:        {view: own, create: own}
parent_invite:  {view: own, create: own, delete: own}
complaint:      {view: own, create: own}
```

#### Parent / Sponsor
```
student_assigned:  {view: own_invited_to}
application:       {view: own_invited_to}
payment:           {view: own_invited_to, create: own_invited_to,
                    approve: own_invited_to}
message:           {view: own_invited_to, create: own_invited_to}
complaint:         {view: own, create: own}
```

### Cross-cutting RBAC rules

- Server-side enforcement only. UI hints from the same source but never
  trusted as a permission boundary.
- Deny by default. If a permission is not explicitly listed, the action
  is denied.
- Cross-tenant access requires explicit allow with audit-log entry.
- Privileged actions logged: `payment.approve`, `payout.approve`,
  `refund.approve`, `visa_file.approve`, `exception.approve`,
  `regulator_notification.create`, `user.delete`, `role_assignment.create`.
- Permission denials logged.

---

## 7. The event catalog (summary; full in docs/02-events.md)

73 events across 9 stages. Every meaningful action emits an event. The
activity feed reads from events; the status timeline derives from events;
notification routing uses per-event visibility and channels.

### Visibility shorthand

S=student, P=parent, C=counsellor, O=operations, OM=ops manager,
CM=counsellor manager, COMP=compliance, F=finance, EM=education manager,
ADMIN=super admin, A=agent.

### Channels

`in_app` (always), `push`, `whatsapp`, `email`.

### Templates

Each event has a template per language (EN/BN/HI/NE). EN is source of truth;
BN/HI/NE flow through the certified-translator pipeline. Templates marked
TBD ship empty and fall back to EN until translated.

### Notification policy

- **Critical** (push + WhatsApp + email, non-disableable): visa decisions,
  offer letters, payment confirmations, blocking document rejections,
  appointment reminders within 24h.
- **Important** (push + WhatsApp, email digest only): document requests,
  counsellor messages, status changes, fair invites.
- **Informational** (in-app only): minor status transitions, system events,
  audit-trail entries.
- **Quiet hours**: default 22:00–08:00 local time.
- **Parent daily digest**: WhatsApp summary at 18:00 local.

---

## 8. SOP-into-app architecture

EduNomad's SOPs are integrated into the app, not maintained as a separate
manual. They become contextual help, decision wizards, inline scripts and
templates, auto-checked quality gates, and a searchable knowledge layer.

### Six ways SOPs surface

1. **Contextual help** — relevant SOP snippet in right rail of relevant screen
2. **Decision wizards** — refund triage, escalation triggers, qualification
   scoring as built-in wizards
3. **Inline scripts / templates** — one-tap insert in dialer / chat panel
4. **Auto-checked quality gates** — checklist blocks gate handoffs
5. **Versioned and audited** — every SOP has a version; "SOP updated"
   banner shows diff; audit log captures who saw which version when
6. **Searchable knowledge layer** — every SOP, template, script searchable

### SOP block types

| Block type | Renders as |
|---|---|
| paragraph | Plain text in panel |
| heading | Section header |
| list / table | Inline |
| script | One-tap insert in dialer / chat |
| template | Message template with `{{variables}}` |
| decision_tree | Wizard form, branching by answer |
| checklist | Enforced gate — must be green to proceed |
| kpi | Live KPI display vs target |
| compliance_warning | Real-time keyword detection; modal on hit |
| trigger_rule | Declarative condition for surfacing |

### Trigger rules

Declarative. Each SOP block can carry one. Platform evaluates continuously;
matching blocks appear in appropriate surface.

```yaml
trigger:
  when: counsellor_opens_lead_detail
  if: student.english_proficiency == 'none' OR
      student.english_proficiency == 'planning'
  surface: lead_detail.right_rail
  show: sop_snippet[no_ielts_pathways]

trigger:
  when: counsellor_message_being_composed
  if: message_content matches keyword_list[unauthorised_promises]
  surface: real_time_modal
  show: sop_block[guard_visa_guarantee]

trigger:
  when: student_attempts_shortlist_lock
  if: student.profile_completeness < 95
  surface: blocking_modal
  show: sop_block[shortlist_lock_quality_gate]
  block_action: true
```

### SOP CMS

Lives at `/admin/sop`. Managers — not engineers — author and edit. Each SOP
has owner, reviewer, block-typed editor, translation status per block, submit
→ review → approve flow, version control with diff, audit log.

---

## 9. Brand and UX baseline

### Visual

- Primary colour: navy `#0B1A2E`
- Accent colour: gold `#C9A84C`
- Background: white
- Text: near-black on white; never pure black
- No gradients. Flat colours only.
- Minimal shadows. 1-pixel rule for cards over drop shadows.
- Typography: a clean modern sans-serif (Inter, Geist, or system default).
  Two weights only — regular and semi-bold.
- Tap targets 44px minimum.
- Iconography: line-style, single weight (Lucide or equivalent).

### Voice and tone

- Warm and trustworthy, not playful.
- Clean and confident, not minimalist for its own sake.
- Direct, never patronising.
- Honest about uncertainty. Never imply guarantees we cannot deliver
  (visa, scholarship, PR).

### UX patterns

- Forms: one column. Inline validation. Save-on-blur for long forms.
  Multi-step forms show progress and allow back / save-and-exit at every step.
- Empty states: every screen has one. Show what would appear, not just
  "no data."
- Loading states: skeleton loaders, not spinners, for content layouts.
- Errors: tell the user their work is safe; explain what to do.
- Confirmations: destructive actions confirm; reversible ones don't.
- Undo over confirm where reversible (Gmail-style toast).

### Mobile-first

- Bottom navigation for primary surfaces (4–5 tabs maximum).
- Sticky action bars for primary CTAs in flows.
- Swipe gestures: dismiss, reveal actions.
- Camera capture for document upload, with auto-crop.
- Pull to refresh on lists and feeds.
- Web Push for notifications.

### Accessibility floor

- WCAG AA minimum on primary user flows.
- Keyboard navigation works on every screen.
- Screen reader labels on all interactive elements.
- Colour is never the only signal.
- Large-font mode toggle (parents primarily).

---

## 10. Performance budgets

Hard limits. If you cross one, escalate.

- Time-to-interactive on 4G ≤ 3s on signup screen
- Profile-builder save latency ≤ 500ms
- Activity feed update ≤ 1s after event emit
- SOP contextual snippet load ≤ 500ms
- Push notification dispatch ≤ 5s after event emit
- Lighthouse PWA audit ≥ 90

---

## 11. Security floor

- Phone OTP primary; rate-limited; 5-minute expiry; 3-attempt lockout
- Sessions: 12h expiry; idle timeout 30 min for internal roles
- 2FA available for all internal roles; mandatory for Compliance + Super Admin
- All RBAC checks server-side
- Audit log entries on permission denials
- All secrets in environment variables or a secret manager — never in code
- Object storage for documents uses signed URLs with short expiry (15 min)
- TLS everywhere
- Document binary never logged
- PII never in logs at INFO level

---

## 12. What's deferred

Do not build any of these in Phase 1. If a goal seems to require them,
escalate.

- Native mobile apps (PWA only, ever)
- Agency tenant UIs (data model accommodates; UIs Phase 2)
- Service Partner tenant UIs (same)
- Inbound email LLM classification (manual classification only in v1;
  clean interface so LLM can plug in later)
- Field-level visa form filler with regulator-current rules (Tier B
  approach for v1: PDF upload + completeness check; Tier C upgrade post-v1)
- Other source markets (India, Nepal) — Phase 2
- Other destinations beyond Phase 1 — Phase 2
- Translation pipeline UI — translators work via spreadsheet export/import
  for now

---

## 13. How to use the slash commands

- `/goals` — show top 5 unblocked goals + current in-progress
- `/goals next` — pick the next goal; open file; propose plan
- `/goals show G023` — display goal in detail
- `/goals done G023` — mark done after `/verify` passes; commit; update index
- `/goals block G023 "reason"` — mark blocked; escalate to human
- `/verify` — run acceptance check on current in-progress goal
- `/next` — alias for `/goals next`
- `/status` — progress snapshot: done / in-progress / blocked / not-started
  by workflow
- `/blocker` — log a blocker for current goal with full context

---

## 14. When to escalate

Escalate via `/blocker` when:

- A goal seems to require violating a non-negotiable constraint (Section 1)
- A goal contradicts another goal or a doc
- An acceptance criterion is ambiguous and you'd be guessing
- A library / service the goal assumes isn't available
- You've spent 2x the estimated size on a goal without converging
- A regulatory rule in `docs/05-reference/destination-rules.md` is unclear

**Better to escalate than to invent.** Under-specified is preferable to
confidently-wrong.

---

## 15. File / commit conventions

- Branch per workflow: `w1/student-onboarding`, `w2/application-packaging`, etc.
- Commit message format: `G023: Counsellor lead inbox with SOP right rail`
- One commit per completed goal
- Goal id in commit makes history fully traceable to the spec
- Update `goals/_index.json` in the same commit that completes the goal
- PR per workflow at the end, not per goal

---

## 16. Tests

- Unit tests for business logic (event handlers, RBAC checks, calculations)
- Integration tests for API endpoints (happy + auth + permission denied)
- End-to-end tests for primary user flows (signup, shortlist lock,
  document upload, payment, visa decision)
- Don't gold-plate test coverage. The acceptance criteria are the test
  spec. Aim for criteria-coverage 100%, line-coverage incidental.

---

## 17. Definition of done — for v1 as a whole

The build is done when:

- All 180 goals across 7 workflows + cross-cutting pass `/verify`
- A real student can complete the journey from signup → shortlist →
  submission → offer → deposit → visa file → visa decision → arrival,
  all visible to them and their parent in 4 languages
- A real counsellor can manage 20+ students through the platform without
  using any other tools
- A real Compliance Lead can sign off on a visa file with full audit
  trail, registration number, hash chain
- A real Finance team can reconcile payments, calculate commissions,
  process payouts, all multi-currency
- Lighthouse PWA audit ≥ 90
- All RBAC denials log audit entries
- All non-test goals have a commit in main with the goal id

---

## 18. References inside the repo

- `docs/00-stack-decisions.md` — your stack picks, evolving
- `docs/01-data-model.md` — full data model
- `docs/02-events.md` — full 73-event catalog
- `docs/03-rbac.md` — full permissions matrix (mirror of Section 6)
- `docs/04-workflows/w1-...md` through `w7-...md` — 7 workflow specs
- `docs/05-reference/` — universities, cost components, destination rules,
  scripts, FAQ, WhatsApp templates, UI copy
- `docs/06-sop-corpus/` — operating manual content per role
- `goals/_index.json` — machine-readable goal index
- `goals/G###-*.md` — individual goal files

---

**You have everything you need. Start with `/goals next`. Build small,
verify often, commit per goal, escalate when stuck.**
