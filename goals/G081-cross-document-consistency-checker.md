---
id: G081
title: Cross-document consistency checker
workflow: W3
deps: ["G075"]
size: L
status: not_started
owner: claude_code
---

# G081 — Cross-document consistency checker

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G075
**Size:** L

## What

Auto run: check name consistency across passport, transcript, IELTS, GIC, etc. Surface inconsistencies.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Extract names from all uploaded docs
2. Compare pairwise for spelling consistency
3. Compare dates: birth date on passport vs other docs
4. Surface inconsistencies as flags on the file
5. Inconsistencies block sign-off until resolved or explained

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G081` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G081: Cross-document consistency checker"`
Update `goals/_index.json` to mark this goal `done`.
