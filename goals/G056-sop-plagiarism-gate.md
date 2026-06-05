---
id: G056
title: SOP plagiarism gate
workflow: W2
deps: ["G055"]
size: M
status: not_started
owner: claude_code
---

# G056 — SOP plagiarism gate

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G055
**Size:** M

## What

Plagiarism >15% blocks save with explanation.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Plagiarism score visible after each draft
2. Score >15% blocks the save button
3. Modal explains the threshold and how to reduce score
4. Score <15% required to advance to lock

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G056` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G056: SOP plagiarism gate"`
Update `goals/_index.json` to mark this goal `done`.
