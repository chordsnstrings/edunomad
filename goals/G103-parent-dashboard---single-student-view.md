---
id: G103
title: Parent dashboard — single student view
workflow: W4
deps: ["G102", "G046"]
size: M
status: not_started
owner: claude_code
---

# G103 — Parent dashboard — single student view

**Workflow:** W4 (Parent visibility and financial approval)
**Dependencies:** G102, G046
**Size:** M

## What

Parent dashboard: student summary, journey timeline, activity feed, upcoming actions, counsellor info, escalation button.

## Why

This goal belongs to workflow W4 (Parent visibility and financial approval). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Layout: top — student + current stage; middle — timeline + feed; bottom — actions + counsellor card
2. Default locale = source-country language; toggle to EN
3. Large-font mode on by default
4. Activity feed filtered for parent-visible events only
5. All translations from microcopy file

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w4-parent-visibility.md`
- `docs/05-reference/parent-faq.md`

## Verification

Run `/verify G103` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G103: Parent dashboard — single student view"`
Update `goals/_index.json` to mark this goal `done`.
