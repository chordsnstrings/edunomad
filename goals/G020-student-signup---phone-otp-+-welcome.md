---
id: G020
title: Student signup — phone OTP + welcome
workflow: W1
deps: ["G008", "G019"]
size: S
status: not_started
owner: claude_code
---

# G020 — Student signup — phone OTP + welcome

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G008, G019
**Size:** S

## What

Signup: phone → OTP → welcome → CTA to profile builder. End-to-end <60s.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Phone entry validated as E.164
2. OTP sent within 3s
3. On verify: user account + Student record created
4. source_attribution carried from landing
5. Welcome screen with single 'Let's start' CTA
6. Total time from landing to welcome <60s on 4G

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G020` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G020: Student signup — phone OTP + welcome"`
Update `goals/_index.json` to mark this goal `done`.
