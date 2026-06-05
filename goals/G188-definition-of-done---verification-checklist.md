---
id: G188
title: Definition of done — verification checklist
workflow: CC
deps: []
size: S
status: not_started
owner: claude_code
---

# G188 — Definition of done — verification checklist

**Workflow:** CC (Cross-cutting platform)
**Dependencies:** (none)
**Size:** S

## What

Single checklist covering all 'done' criteria from CLAUDE.md §17. Run before final sign-off.

## Why

This goal belongs to workflow CC (Cross-cutting platform). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Checklist mirrors §17
2. All 180 goals done (per _index.json)
3. All E2E tests passing
4. Lighthouse PWA ≥ 90
5. All RBAC denials log audit
6. Final acceptance: all commits in main with goal ids

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md §10, §11`

## Verification

Run `/verify G188` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G188: Definition of done — verification checklist"`
Update `goals/_index.json` to mark this goal `done`.
