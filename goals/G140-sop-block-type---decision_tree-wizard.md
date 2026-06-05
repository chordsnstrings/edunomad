---
id: G140
title: SOP block type — decision_tree (wizard)
workflow: W6
deps: ["G137"]
size: M
status: not_started
owner: claude_code
---

# G140 — SOP block type — decision_tree (wizard)

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G137
**Size:** M

## What

Decision tree: branching conditions + outcomes. Renders as wizard.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Editor: visual tree of conditions
2. Each branch: condition + action (allow/block/redirect)
3. Renders in product as a step-by-step wizard
4. Outcomes captured as event data

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G140` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G140: SOP block type — decision_tree (wizard)"`
Update `goals/_index.json` to mark this goal `done`.
