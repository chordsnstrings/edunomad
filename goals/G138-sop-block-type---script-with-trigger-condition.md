---
id: G138
title: SOP block type — script (with trigger condition)
workflow: W6
deps: ["G137"]
size: S
status: not_started
owner: claude_code
---

# G138 — SOP block type — script (with trigger condition)

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G137
**Size:** S

## What

Script block: text + trigger condition + surface designation.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Editor: trigger condition input (DSL), surface picker (dialer_right_rail, etc.), text body
2. Renders in product as one-tap insert with the text
3. Trigger evaluated against runtime context

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G138` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G138: SOP block type — script (with trigger condition)"`
Update `goals/_index.json` to mark this goal `done`.
