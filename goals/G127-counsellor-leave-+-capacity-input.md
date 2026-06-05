---
id: G127
title: Counsellor leave + capacity input
workflow: W5
deps: []
size: S
status: not_started
owner: claude_code
---

# G127 — Counsellor leave + capacity input

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** (none)
**Size:** S

## What

Counsellors submit leave; CM approves. Leave reduces auto-routing capacity.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Leave request entity
2. CM approves/declines
3. Approved leave reduces auto-routing capacity for those days

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G127` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G127: Counsellor leave + capacity input"`
Update `goals/_index.json` to mark this goal `done`.
