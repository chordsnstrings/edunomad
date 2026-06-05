---
id: G033
title: WhatsApp greeting template insert + send
workflow: W1
deps: ["G013", "G032"]
size: S
status: not_started
owner: claude_code
---

# G033 — WhatsApp greeting template insert + send

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G013, G032
**Size:** S

## What

Counsellor taps WhatsApp → picks template → sends. Records Communication; emits counsellor.message_received.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Template picker shows approved templates in student's language
2. Variables auto-filled from student record
3. Preview before send
4. On send: WhatsApp API call + Communication row + event
5. Student sees the message in in-app chat

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G033` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G033: WhatsApp greeting template insert + send"`
Update `goals/_index.json` to mark this goal `done`.
