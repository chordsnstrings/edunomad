---
id: G187
title: End-to-end test — counsellor + ops + compliance flow
workflow: CC
deps: ["G091"]
size: L
status: not_started
owner: claude_code
---

# G187 — End-to-end test — counsellor + ops + compliance flow

**Workflow:** CC (Cross-cutting platform)
**Dependencies:** G091
**Size:** L

## What

E2E test for internal roles: receive lead → call → qualify → package → submit → visa file → sign-off.

## Why

This goal belongs to workflow CC (Cross-cutting platform). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Counsellor user, Ops user, Compliance user roles tested
2. All RBAC checks pass appropriately
3. Auto-routing tested
4. Runs in CI

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md §10, §11`

## Verification

Run `/verify G187` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G187: End-to-end test — counsellor + ops + compliance flow"`
Update `goals/_index.json` to mark this goal `done`.
