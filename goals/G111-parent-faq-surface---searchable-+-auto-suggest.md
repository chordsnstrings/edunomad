---
id: G111
title: Parent FAQ surface — searchable + auto-suggest
workflow: W4
deps: ["G103"]
size: M
status: not_started
owner: claude_code
---

# G111 — Parent FAQ surface — searchable + auto-suggest

**Workflow:** W4 (Parent visibility and financial approval)
**Dependencies:** G103
**Size:** M

## What

FAQ tab in parent dashboard. 30 questions. Auto-suggest in chat input.

## Why

This goal belongs to workflow W4 (Parent visibility and financial approval). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. FAQ tab lists 30 questions by category
2. Search bar with fuzzy match
3. When parent types in chat, top-3 matching FAQs suggested
4. Tap question → expanded answer in parent's language

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w4-parent-visibility.md`
- `docs/05-reference/parent-faq.md`

## Verification

Run `/verify G111` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G111: Parent FAQ surface — searchable + auto-suggest"`
Update `goals/_index.json` to mark this goal `done`.
