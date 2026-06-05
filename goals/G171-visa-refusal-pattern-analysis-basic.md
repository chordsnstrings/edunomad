---
id: G171
title: Visa refusal pattern analysis (basic)
workflow: W7
deps: ["G092"]
size: M
status: not_started
owner: claude_code
---

# G171 — Visa refusal pattern analysis (basic)

**Workflow:** W7 (Compliance audit trail and incident response)
**Dependencies:** G092
**Size:** M

## What

Compliance can view refused visas filtered by reason / destination / period to spot patterns.

## Why

This goal belongs to workflow W7 (Compliance audit trail and incident response). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. List view of refused visa files
2. Filters: destination, reason category, period, counsellor, ops member
3. Aggregates: refusal rate, common reasons
4. Export to PDF for board review

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w7-compliance-audit.md`

## Verification

Run `/verify G171` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G171: Visa refusal pattern analysis (basic)"`
Update `goals/_index.json` to mark this goal `done`.
