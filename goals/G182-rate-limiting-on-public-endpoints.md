---
id: G182
title: Rate limiting on public endpoints
workflow: CC
deps: ["G008"]
size: S
status: not_started
owner: claude_code
---

# G182 — Rate limiting on public endpoints

**Workflow:** CC (Cross-cutting platform)
**Dependencies:** G008
**Size:** S

## What

Rate limits on auth endpoints + API endpoints prone to abuse.

## Why

This goal belongs to workflow CC (Cross-cutting platform). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. OTP send: 3/hour per phone
2. OTP verify: 5/hour per phone
3. General API: 100/min per session
4. 429 response with retry-after

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md §10, §11`

## Verification

Run `/verify G182` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G182: Rate limiting on public endpoints"`
Update `goals/_index.json` to mark this goal `done`.
