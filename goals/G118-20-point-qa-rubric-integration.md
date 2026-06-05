---
id: G118
title: 20-point QA rubric integration
workflow: W5
deps: ["G117"]
size: S
status: not_started
owner: claude_code
---

# G118 — 20-point QA rubric integration

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** G117
**Size:** S

## What

20 checkable items per QA review (greeting, qualification, objection handling, compliance, closure, etc.).

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. 20 items configurable via SOP CMS later; hard-coded for v1
2. Each item: pass/fail/n_a + optional note
3. Score = % passed
4. Per-counsellor rolling average

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G118` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G118: 20-point QA rubric integration"`
Update `goals/_index.json` to mark this goal `done`.
