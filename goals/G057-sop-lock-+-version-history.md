---
id: G057
title: SOP lock + version history
workflow: W2
deps: ["G055"]
size: S
status: not_started
owner: claude_code
---

# G057 — SOP lock + version history

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G055
**Size:** S

## What

Lock SOP version. Subsequent edits create new versions.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. sop.locked event with version number
2. Locked SOP read-only on application detail
3. Edit creates new version with diff visible
4. Audit log of all version locks

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G057` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G057: SOP lock + version history"`
Update `goals/_index.json` to mark this goal `done`.
