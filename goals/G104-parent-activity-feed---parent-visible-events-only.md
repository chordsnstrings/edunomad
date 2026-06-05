---
id: G104
title: Parent activity feed — parent-visible events only
workflow: W4
deps: ["G103", "G018"]
size: S
status: not_started
owner: claude_code
---

# G104 — Parent activity feed — parent-visible events only

**Workflow:** W4 (Parent visibility and financial approval)
**Dependencies:** G103, G018
**Size:** S

## What

Feed identical to student's structurally, but filter visibility map for parent.

## Why

This goal belongs to workflow W4 (Parent visibility and financial approval). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. GET /api/feed scopes to parent-visible events
2. Render in parent's language
3. Mark-read state per parent user
4. Pagination identical

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w4-parent-visibility.md`
- `docs/05-reference/parent-faq.md`

## Verification

Run `/verify G104` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G104: Parent activity feed — parent-visible events only"`
Update `goals/_index.json` to mark this goal `done`.
