---
id: G068
title: Student offer accept / decline UI
workflow: W2
deps: ["G067"]
size: S
status: not_started
owner: claude_code
---

# G068 — Student offer accept / decline UI

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G067
**Size:** S

## What

Student accepts or declines an offer. Confirmation modal explains next steps (deposit due, etc.).

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Accept/decline buttons on offer detail
2. Accept confirmation explains deposit due + visa next steps
3. Decline confirmation asks for reason (optional)
4. Emits offer.accepted / offer.declined
5. Triggers invoice creation on accept

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G068` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G068: Student offer accept / decline UI"`
Update `goals/_index.json` to mark this goal `done`.
