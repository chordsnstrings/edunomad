---
id: G125
title: Counsellor hiring pipeline view (basic)
workflow: W5
deps: []
size: M
status: not_started
owner: claude_code
---

# G125 — Counsellor hiring pipeline view (basic)

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** (none)
**Size:** M

## What

/counsellor-manager/hiring. Candidates in pipeline with stages.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Pipeline stages: applied / screening / interview1 / interview2 / offer / hired / declined
2. Per-candidate notes + scoring
3. Interview scheduling integration
4. Export to spreadsheet

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G125` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G125: Counsellor hiring pipeline view (basic)"`
Update `goals/_index.json` to mark this goal `done`.
