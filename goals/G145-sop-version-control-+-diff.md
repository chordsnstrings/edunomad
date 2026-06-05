---
id: G145
title: SOP version control + diff
workflow: W6
deps: ["G137"]
size: M
status: not_started
owner: claude_code
---

# G145 — SOP version control + diff

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G137
**Size:** M

## What

Editing publishes a new version. Diff visible between versions.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Save creates new version (draft)
2. Publish promotes draft to published; previous becomes archived
3. Diff view: block-by-block changes (added/removed/modified)
4. Version selector
5. Audit log entry per publish

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G145` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G145: SOP version control + diff"`
Update `goals/_index.json` to mark this goal `done`.
