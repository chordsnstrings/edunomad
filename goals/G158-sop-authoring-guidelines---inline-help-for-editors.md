---
id: G158
title: SOP authoring guidelines — inline help for editors
workflow: W6
deps: ["G137"]
size: S
status: not_started
owner: claude_code
---

# G158 — SOP authoring guidelines — inline help for editors

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G137
**Size:** S

## What

Inline help in editor: when to use each block type, examples, gotchas.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Each block type has inline help drawer
2. Examples + 'common mistakes' per type
3. Available without leaving editor

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G158` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G158: SOP authoring guidelines — inline help for editors"`
Update `goals/_index.json` to mark this goal `done`.
