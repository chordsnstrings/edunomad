---
id: G178
title: Analytics — privacy-respecting product analytics
workflow: CC
deps: ["G001"]
size: S
status: not_started
owner: claude_code
---

# G178 — Analytics — privacy-respecting product analytics

**Workflow:** CC (Cross-cutting platform)
**Dependencies:** G001
**Size:** S

## What

Plausible / Posthog / GA4 integrated. No PII tracking. Funnel analysis for key flows.

## Why

This goal belongs to workflow CC (Cross-cutting platform). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Service integrated
2. Funnels: signup → profile → eligibility → shortlist lock → submitted → offered → visa
3. Per-event analytics tied to event catalog where appropriate
4. Cookie consent if applicable
5. Stack decision logged

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md §10, §11`

## Verification

Run `/verify G178` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G178: Analytics — privacy-respecting product analytics"`
Update `goals/_index.json` to mark this goal `done`.
