---
id: G114
title: Parent app lock + PIN re-enter
workflow: W4
deps: ["G102"]
size: S
status: not_started
owner: claude_code
---

# G114 — Parent app lock + PIN re-enter

**Workflow:** W4 (Parent visibility and financial approval)
**Dependencies:** G102
**Size:** S

## What

Parent app locks after 5 min inactivity; PIN re-entry to unlock.

## Why

This goal belongs to workflow W4 (Parent visibility and financial approval). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Idle timer: 5 min
2. Lock screen renders PIN entry
3. Wrong PIN 3 times → sign-out required
4. Setting to disable lock for power users

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w4-parent-visibility.md`
- `docs/05-reference/parent-faq.md`

## Verification

Run `/verify G114` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G114: Parent app lock + PIN re-enter"`
Update `goals/_index.json` to mark this goal `done`.
