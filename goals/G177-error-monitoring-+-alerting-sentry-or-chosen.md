---
id: G177
title: Error monitoring + alerting (Sentry or chosen)
workflow: CC
deps: ["G001"]
size: S
status: not_started
owner: claude_code
---

# G177 — Error monitoring + alerting (Sentry or chosen)

**Workflow:** CC (Cross-cutting platform)
**Dependencies:** G001
**Size:** S

## What

Error monitoring service integrated. Alerts to relevant on-call.

## Why

This goal belongs to workflow CC (Cross-cutting platform). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Service integrated; errors flow with stack traces + user context (no PII)
2. Alert routing per severity
3. Stack decision logged

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md §10, §11`

## Verification

Run `/verify G177` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G177: Error monitoring + alerting (Sentry or chosen)"`
Update `goals/_index.json` to mark this goal `done`.
