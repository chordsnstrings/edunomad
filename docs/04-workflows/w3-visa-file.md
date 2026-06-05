# Workflow 3 — Visa file preparation, sign-off, submission

| Attribute | Value |
|---|---|
| Actors | Operations Team, Operations Manager, Compliance (RCIC/MARA), Student/Parent (visibility) |
| Trigger | Student receives unconditional offer + accepts + pays tuition deposit |
| Outcome | Visa file submitted; status tracked through to decision |
| Duration | 2–6 weeks prep + 4–16 weeks decision wait |
| Languages | All file content EN; student-facing comms in student's language |

## Step-by-step

### 1. Trigger detection
System detects: unconditional offer → student accepted → tuition deposit paid → LOA/CAS/COE received. Visa file workflow auto-creates.

### 2. Visa file builder — Tier B approach
**Important:** v1 uses Tier B — PDF upload + checklist-based completeness check. No field-level validating form filler. The forms repository (see destination-rules) holds the latest version of each regulator's PDF; Compliance updates this when regulators publish revisions.

Per-country builder loads checklist from destination_rules:
- **Forms section:** Operations downloads each required form from the in-app forms repository, completes manually outside the app, uploads filled PDF. System runs a completeness check.
- **Financial proof:** GIC certificate, tuition deposit receipt, family financial documents
- **Photos:** per-destination spec, in-app cropper enforces dimensions
- **SOP / study plan:** separate from university SOP, addressed to visa officer
- **Sponsor declaration** if applicable
- **Police certificate** if required
- **Medical exam results** if required
- **Translations** if required

Builder shows running progress against per-country checklist.

### 3. Pre-Compliance audit
Builder reaches 100% → case moves to Operations Manager's pre-Compliance queue. Ops Manager reviews. Returns with gaps or forwards to Compliance.

### 4. Compliance sign-off
Compliance Lead opens the case. Sign-off interface:
- Full visa file as single navigable view
- Per-country sign-off checklist
- Misrepresentation flag detector (auto cross-document consistency check)
- Annotation tool for returning with changes
- Sign-off button (requires re-authentication)

Three outcomes:
- **Sign:** RCIC/MARA registration number stamped; file version hash captured; audit log entry; state → "Signed."
- **Return:** Annotated changes to ops; state remains "In Compliance" until resubmitted.
- **Refuse:** File stops. Reasons captured per regulatory citation. Escalated to Education Manager.

### 5. Submission to VFS / IRCC / equivalent
After sign-off: ops books VFS appointment via destination's official portal. Student receives confirmation. Student attends biometrics; ops confirms. Application submitted via destination's official channel. Submission proof captured.

### 6. Status tracking to decision
Per-destination tracker watches the application. Canada: IRCC portal daily; UK: UKVI; AU: ImmiAccount; MY: EMGS. Status events emitted; student/parent notified per event policy.

### 7. Decision handling
- **Approved:** Pre-Departure workflow auto-triggers. Counsellor calls for celebratory check-in.
- **Refused:** Counsellor calls student + parent personally. System loads refusal reasons, suggests reapplication or alternative pathway. Compliance reviews for systemic learning.
- **Additional docs requested:** Back to Operations queue with priority flag.

## SOP integrations

| Trigger | SOP surfaced | Where |
|---|---|---|
| Visa file workflow auto-created | Per-country checklist | Loaded in builder |
| Working on Canadian visa file | IRCC current rules from bulletin | Inline guidance |
| GIC amount or threshold changes | Regulatory bulletin updates | Banner on visa file builder |
| Cross-document inconsistency | Misrepresentation decision tree | Auto-flag in pre-Compliance |
| Compliance about to sign | Sign-off checklist | Pre-action confirmation modal |
| Compliance refuses to sign | Refusal protocol | Reasoning template; auto-escalation |
| Visa decision arrives | Refusal handling; celebratory check-in | Counsellor's notification |
| Misrepresentation post-sign-off | Regulatory notification protocol | Compliance-only flow |
