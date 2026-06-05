---
id: G141
title: SOP block type — checklist (enforced gate)
workflow: W6
deps: ["G137"]
size: M
status: not_started
owner: claude_code
---

# G141 — SOP block type — checklist (enforced gate)

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G137
**Size:** M

## What

Checklist: conditions that must be true to proceed past a gate.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Editor: condition list, gate identifier
2. Conditions reference data fields (DSL)
3. Renders in product as gating check on actions
4. Blocks action with itemised failure reasons

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G141` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G141: SOP block type — checklist (enforced gate)"`
Update `goals/_index.json` to mark this goal `done`.
