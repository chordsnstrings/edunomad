# Workflow 1 — Student onboarding through shortlist lock

| Attribute | Value |
|---|---|
| Actors | Student (primary), Parent (read-only via invite), Counsellor, Counsellor Manager (oversight) |
| Trigger | Student lands on landing page from ad / referral / fair QR / organic |
| Outcome | Profile complete, qualified, shortlist locked, handed to Operations |
| Duration | 5–10 days, 4–6 sessions |
| Languages | EN / BN / HI / NE student-facing; counsellor SOPs in EN |

## Goals in this workflow

See `goals/` files prefixed `G0xx` where workflow == "W1".

## Step-by-step flow

### 1. Landing → signup
- Phone OTP auth (email captured later, optional)
- Country detected from IP, language defaulted accordingly, override toggle visible
- Source attribution captured (UTM, referral code, fair QR token)
- Time on screen target: <60s end-to-end

### 2. Welcome → profile builder kickoff
Welcome screen: "We'll spend the next 10 minutes understanding your background. Save anytime; come back when you want."

### 3. Profile builder (multi-step, save on every field)
Six steps, each on its own screen:
1. Academic background (qualification, board / institution, percentage / GPA, year)
2. English proficiency (IELTS / Duolingo / PTE in hand, planning, MOI letter, none)
3. Destination preferences (CA / UK / AU / MY, ranked)
4. Field of study (broad category → narrower)
5. Budget (annual range, source of funds free-text)
6. Intake target (next viable, flexible, undecided)

Progress bar across the top. Each step has back, save-and-exit. Inline validation. After each step, a save event fires; partial profile queryable by counsellors.

### 4. Eligibility check
After step 6, system runs eligibility logic: "You qualify for X programmes across Y universities. Estimated total cost: BDT Z." Three tabs: Reach / Match / Safe. Student can drill into each programme.

### 5. Counsellor auto-assignment
Routing = (language preference) × (destination expertise) × (current load) × (lead score).
Student sees "Your counsellor is [Name], speaks [languages]. They'll WhatsApp you within 4 working hours."

### 6. First counsellor contact (within 4 working hours)
Counsellor sees lead in inbox with full profile + lead score + source. Reviews (90s), sends WhatsApp greeting via approved template (one tap), schedules first call via in-app calendar.

### 7. First call (45 min, typically student + parent)
Counsellor opens student profile. Right rail shows the Counsellor SOP §6 inline (intro script + 10 qualification questions + objection responses). Integrated dialer with live transcription in counsellor's language. Notes captured via voice-to-text or typed.

After: tag outcome (warm/cold/qualified/hot), push personalised doc checklist, schedule next touchpoint, auto-summary message via WhatsApp template.

### 8. Document collection (1–7 days)
Doc vault. Per-type guidance copy (4 languages), example image, accepted formats, max size. Camera capture with auto-crop on mobile. Auto first-pass check (legibility, expected type, name OCR vs profile), then human QA queue.

### 9. Shortlist conversation (call 2)
Counsellor + student review auto-generated shortlist. Student adds/removes. Counsellor recommends with rationale captured per choice. Max 6 active shortlists.

### 10. Shortlist lock
Student taps "Lock shortlist." Modal: "Locking moves this to our Operations team. You can unlock with counsellor approval before submission." Confirm → fires Operations handoff.

## SOP integrations

| Trigger | SOP surfaced | Where |
|---|---|---|
| Counsellor opens new lead | Lead-qualification rubric | Right rail of lead detail |
| Counsellor starts a call | Intro script + 10 questions | Slide-in panel from dialer |
| Student in profile builder, asks help | Per-field guidance | Inline help icon |
| Counsellor encounters objection | Top-15 objections + responses | Searchable panel in dialer |
| Counsellor uses a WhatsApp template | Approved templates in student's language | One-tap insert |
| Lead doesn't reach 4/5 qualification floor | Qualify-or-disqualify decision tree | Modal on follow-up attempt |
| Counsellor about to make unauthorised promise | Misrepresentation flag | Real-time modal (keyword detection) |
| Profile completeness <95% at shortlist lock | Quality standards gate | Block lock; show missing |
| Counsellor needs to escalate | Escalation paths | Form prefilled with case context |
