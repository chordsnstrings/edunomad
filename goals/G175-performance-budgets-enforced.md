---
id: G175
title: Performance budgets enforced
workflow: CC
deps: []
size: M
status: not_started
owner: claude_code
---

# G175 — Performance budgets enforced

**Workflow:** CC (Cross-cutting platform)
**Dependencies:** (none)
**Size:** M

## What

Performance budgets from CLAUDE.md §10 enforced via lighthouse and synthetic tests.

## Why

This goal belongs to workflow CC (Cross-cutting platform). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. TTI on 4G ≤ 3s for signup screen
2. Profile-builder save latency ≤ 500ms
3. Activity feed update latency ≤ 1s
4. SOP contextual snippet load ≤ 500ms
5. Push notification dispatch ≤ 5s after event emit
6. Synthetic tests in CI fail if budgets breached

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md §10, §11`

## Verification

Run `/verify G175` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G175: Performance budgets enforced"`
Update `goals/_index.json` to mark this goal `done`.
