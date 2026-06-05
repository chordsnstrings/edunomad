---
id: G034
title: Calendar booker — schedule call with student
workflow: W1
deps: ["G032"]
size: M
status: not_started
owner: claude_code
---

# G034 — Calendar booker — schedule call with student

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G032
**Size:** M

## What

Counsellor picks slot; confirms via WhatsApp + email. Emits counsellor.call_scheduled.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Counsellor calendar shows next 7 days with available slots
2. Pick slot + duration (default 45 min)
3. Confirm dialog with student's timezone display
4. On confirm: event emitted, WhatsApp + email sent
5. Reschedule link in WhatsApp works

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G034` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G034: Calendar booker — schedule call with student"`
Update `goals/_index.json` to mark this goal `done`.
