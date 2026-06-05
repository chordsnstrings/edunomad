---
id: G176
title: WCAG AA accessibility validation on primary flows
workflow: CC
deps: ["G015"]
size: M
status: not_started
owner: claude_code
---

# G176 — WCAG AA accessibility validation on primary flows

**Workflow:** CC (Cross-cutting platform)
**Dependencies:** G015
**Size:** M

## What

Automated axe-core check on primary flows; manual screen-reader test.

## Why

This goal belongs to workflow CC (Cross-cutting platform). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. axe-core integrated; CI fails on violations
2. Manual screen-reader walk-through (VoiceOver/TalkBack) on signup, profile builder, shortlist lock, payment
3. Keyboard navigation works on every screen
4. Colour-only signals identified and supplemented

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md §10, §11`

## Verification

Run `/verify G176` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G176: WCAG AA accessibility validation on primary flows"`
Update `goals/_index.json` to mark this goal `done`.
