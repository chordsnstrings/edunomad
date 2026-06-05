---
id: G117
title: CM QA review tool — weighted sampling
workflow: W5
deps: ["G035"]
size: L
status: not_started
owner: claude_code
---

# G117 — CM QA review tool — weighted sampling

**Workflow:** W5 (Counsellor Manager day-to-day)
**Dependencies:** G035
**Size:** L

## What

Sample 5–8 calls + 5–8 WhatsApp threads daily. Auto-weighted to ensure ≥5/counsellor/month.

## Why

This goal belongs to workflow W5 (Counsellor Manager day-to-day). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Sampling algorithm weights by counsellor coverage
2. List of sampled items shown to CM
3. Tap to review: call recording + transcript / WhatsApp thread
4. 20-point QA rubric inline
5. Per-item scoring captured
6. Auto-generated scorecard per counsellor

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w5-counsellor-manager.md`

## Verification

Run `/verify G117` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G117: CM QA review tool — weighted sampling"`
Update `goals/_index.json` to mark this goal `done`.
