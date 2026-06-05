---
id: G019
title: Landing page with source attribution
workflow: W1
deps: ["G015"]
size: S
status: not_started
owner: claude_code
---

# G019 — Landing page with source attribution

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G015
**Size:** S

## What

Public landing. Captures UTM, referral_code, fair_qr_token. Single 'Get started' CTA.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Page loads in <2s on 4G
2. UTM/referral params captured to session storage
3. Country detection from IP (default BD); language defaults from country
4. Language switcher visible

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G019` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G019: Landing page with source attribution"`
Update `goals/_index.json` to mark this goal `done`.
