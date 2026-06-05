---
id: G186
title: End-to-end test — happy path student journey
workflow: CC
deps: ["G068", "G091"]
size: L
status: not_started
owner: claude_code
---

# G186 — End-to-end test — happy path student journey

**Workflow:** CC (Cross-cutting platform)
**Dependencies:** G068, G091
**Size:** L

## What

Single E2E test walking through: signup → profile → eligibility → shortlist lock → submission → offer → accept → deposit → visa file → sign-off → approval.

## Why

This goal belongs to workflow CC (Cross-cutting platform). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Playwright or chosen E2E framework
2. Test runs against staging
3. All 9 stages traversed
4. Run time < 5 min
5. Runs in CI

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md §10, §11`

## Verification

Run `/verify G186` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G186: End-to-end test — happy path student journey"`
Update `goals/_index.json` to mark this goal `done`.
