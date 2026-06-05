---
id: G018
title: Activity feed query + visibility filtering
workflow: W0
deps: ["G005", "G006"]
size: M
status: not_started
owner: claude_code
---

# G018 — Activity feed query + visibility filtering

**Workflow:** W0 (Foundations)
**Dependencies:** G005, G006
**Size:** M

## What

Given a user, return events visible to them, paginated newest first.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. GET /api/feed?cursor=... returns events visible to user
2. Visibility filter applied: only events where user's role in event.visibility
3. Pagination cursor-based
4. Rendered template string included per event
5. Update latency ≤ 1s after event emit
6. Read indicator from EventRead table

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G018` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G018: Activity feed query + visibility filtering"`
Update `goals/_index.json` to mark this goal `done`.
