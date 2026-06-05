---
id: G061
title: Tier 3 API submission (stubbed)
workflow: W2
deps: ["G058"]
size: S
status: not_started
owner: claude_code
---

# G061 — Tier 3 API submission (stubbed)

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G058
**Size:** S

## What

Interface for API submission. Per-uni adapter pattern. Stubbed for v1; real adapters added as partners come online.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Adapter interface defined
2. Stub adapter that logs and returns 'submitted' for testing
3. Submission method selectable per uni
4. Submission proof captured as API response

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G061` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G061: Tier 3 API submission (stubbed)"`
Update `goals/_index.json` to mark this goal `done`.
