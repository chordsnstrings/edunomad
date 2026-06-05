---
id: G181
title: Health endpoints + uptime monitoring
workflow: CC
deps: ["G180"]
size: S
status: not_started
owner: claude_code
---

# G181 — Health endpoints + uptime monitoring

**Workflow:** CC (Cross-cutting platform)
**Dependencies:** G180
**Size:** S

## What

/health endpoint + uptime monitoring service integrated.

## Why

This goal belongs to workflow CC (Cross-cutting platform). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. GET /health returns 200 with DB connectivity check
2. Uptime monitor pings every 1 min
3. Alerts to on-call on 2 consecutive failures

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md §10, §11`

## Verification

Run `/verify G181` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G181: Health endpoints + uptime monitoring"`
Update `goals/_index.json` to mark this goal `done`.
