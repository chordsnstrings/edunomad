---
id: G143
title: SOP block type — compliance_warning (keyword guards)
workflow: W6
deps: ["G137", "G038"]
size: S
status: not_started
owner: claude_code
---

# G143 — SOP block type — compliance_warning (keyword guards)

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G137, G038
**Size:** S

## What

Compliance warning: keyword list + modal text. Wires into counsellor message guards.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Editor: keyword list + modal text body
2. Loaded into runtime guards (G038)
3. Updates immediately on publish

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G143` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G143: SOP block type — compliance_warning (keyword guards)"`
Update `goals/_index.json` to mark this goal `done`.
