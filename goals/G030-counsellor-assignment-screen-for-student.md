---
id: G030
title: Counsellor assignment screen for student
workflow: W1
deps: ["G029"]
size: S
status: not_started
owner: claude_code
---

# G030 — Counsellor assignment screen for student

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G029
**Size:** S

## What

Screen after eligibility: counsellor name, photo, languages, tenure.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Renders counsellor: photo, name, languages, tenure
2. Two CTAs: Send message, Book call
3. Null state: 'Our team will be in touch shortly'

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G030` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G030: Counsellor assignment screen for student"`
Update `goals/_index.json` to mark this goal `done`.
