---
id: G062
title: Submission proof gate
workflow: W2
deps: ["G059", "G060", "G061"]
size: S
status: not_started
owner: claude_code
---

# G062 — Submission proof gate

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G059, G060, G061
**Size:** S

## What

Application cannot move past submission state without proof attached.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Check on every submission method
2. If proof missing: status remains 'packaged'
3. Submission proof visible in application detail (email screenshot, portal screenshot, API response)

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G062` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G062: Submission proof gate"`
Update `goals/_index.json` to mark this goal `done`.
