# Workflow 2 — Application packaging through submission

| Attribute | Value |
|---|---|
| Actors | Operations Team, Operations Manager, Counsellor (visibility), Student/Parent (visibility) |
| Trigger | Counsellor locks shortlist |
| Outcome | Application packaged and submitted to each university; submission proof captured |
| Duration | 3–10 days per application |
| Languages | Operations work in EN; student-facing comms in student's language |

## Step-by-step

### 1. Receive locked shortlist
Operations work queue. Sorted by intake deadline + university SLA. Each ops member sees assigned cases.

### 2. Pre-packaging audit
Per-case view: profile completeness; document inventory (uploaded vs missing); shortlist with rationale; counsellor notes; per-uni packaging requirements (loaded from universities database). If anything missing or QA-failed, trigger doc rework via templated WhatsApp.

### 3. SOP polish (three paths)
- **Path A:** Student used in-app SOP builder with Claude API. Ops refines for tone/length per destination.
- **Path B:** No draft. Ops uses Claude API in-app to generate first draft from profile + counsellor notes, then refines.
- **Path C:** Student provided own SOP. Ops runs plagiarism check, refines.

Polish screen: live word count vs destination target; plagiarism score (must be <15%); per-destination tone guide; side-by-side draft vs current; counsellor's notes; version-controlled save.

### 4. Document QA
30-item rubric per document type (passport, transcript, IELTS, financials, photos). Checkboxes with auto-fail conditions visible. Ops can reject (with reason) or request rework (templated WhatsApp).

### 5. Packaging
Per-programme: checklist visible (loaded from universities database); drag-drop document assembler; auto-generated cover letter from template; application form filled (where uni accepts our format) or links to uni's portal credentials; application fee payment (where applicable). Packet preview as single PDF.

### 6. Submission (auto-detect tier)
- **Tier 1 (email):** Templated email with packet attached; sent to known admissions contact; capture sent timestamp + recipient + reference_id auto-embedded in subject `[EDUNOMAD-APP-XXXX]`.
- **Tier 2 (portal):** Open vaulted portal credentials; ops submits manually; captures portal screenshot as proof.
- **Tier 3 (API):** Direct API call; response captured as proof.

Submission proof attached to application record automatically.

### 7. Status maintenance — MANUAL CLASSIFICATION ONLY in v1
Inbound parser detects new emails matching open application records via `[EDUNOMAD-APP-XXXX]` reference ID. Operations sees a "new replies" inbox: opens the email, classifies manually (offer / conditional / reject / RFI / acknowledge) with one tap, uploads attached offer letter or supporting documents. Status updates from the manual classification.

**Important:** Build the interface to accept a `(classification, confidence)` pair so an LLM classifier can be added later without rework. For v1, `confidence = 1.0` (human did it).

## SOP integrations

| Trigger | SOP surfaced | Where |
|---|---|---|
| Ops opens new case | Work-queue priority logic | Sidebar |
| Ops starts SOP polish | SOP framework + per-destination tone guide | Right rail |
| SOP plagiarism >15% | Redraft decision tree | Modal blocks save |
| Document fails QA | Doc QA rubric per type | Inline on doc QA screen |
| Doc rework needed | Templated WhatsApp message | One-tap from doc QA |
| Ops packages an application | Per-uni packaging checklist | Embedded in packaging tool |
| Ops about to submit | Quality standards (checklist green) | Pre-submission confirmation modal |
| Submission proof not captured | Compliance requirements | Block submission |
| Suspected fraud | Misrepresentation flag | Auto-flag + escalation prefilled |
