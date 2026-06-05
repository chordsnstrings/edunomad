---
id: G035
title: Integrated dialer with call recording + transcription
workflow: W1
deps: ["G034"]
size: L
status: not_started
owner: claude_code
---

# G035 — Integrated dialer with call recording + transcription

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G034
**Size:** L

## What

Dialer with Twilio Voice (or chosen). Call recorded, transcribed in counsellor's language.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Dialer opens at call time with student's number prefilled
2. Call placed via integrated telephony
3. Recording starts automatically; transcription streams in real time
4. Transcript saved to Communication row
5. Counsellor can type/voice notes during call
6. counsellor.call_completed emitted with outcome_tag (warm/cold/qualified/hot)

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G035` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G035: Integrated dialer with call recording + transcription"`
Update `goals/_index.json` to mark this goal `done`.
