---
id: G139
title: SOP block type — template (with variables)
workflow: W6
deps: ["G137"]
size: S
status: not_started
owner: claude_code
---

# G139 — SOP block type — template (with variables)

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G137
**Size:** S

## What

Template block: text with {{var}} placeholders + variable list.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Editor: text body with variable picker
2. Variables list editable
3. Renders in product with variable substitution at insert time

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G139` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G139: SOP block type — template (with variables)"`
Update `goals/_index.json` to mark this goal `done`.
