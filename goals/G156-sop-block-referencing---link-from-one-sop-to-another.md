---
id: G156
title: SOP block referencing — link from one SOP to another
workflow: W6
deps: ["G135"]
size: S
status: not_started
owner: claude_code
---

# G156 — SOP block referencing — link from one SOP to another

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G135
**Size:** S

## What

Blocks can reference other SOP blocks by id (for shared scripts, templates).

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Reference syntax in editor
2. Renders inline at view time
3. Updates propagate when referenced block changes
4. Circular reference detection

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G156` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G156: SOP block referencing — link from one SOP to another"`
Update `goals/_index.json` to mark this goal `done`.
