---
id: G174
title: Lighthouse PWA audit ≥ 90
workflow: CC
deps: ["G003", "G016"]
size: M
status: not_started
owner: claude_code
---

# G174 — Lighthouse PWA audit ≥ 90

**Workflow:** CC (Cross-cutting platform)
**Dependencies:** G003, G016
**Size:** M

## What

Run Lighthouse on production-like build; achieve ≥ 90 on PWA dimensions.

## Why

This goal belongs to workflow CC (Cross-cutting platform). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Lighthouse CI integrated into build
2. PWA score ≥ 90
3. Manifest valid
4. Service worker passes all PWA checks
5. Offline functionality verified

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md §10, §11`

## Verification

Run `/verify G174` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G174: Lighthouse PWA audit ≥ 90"`
Update `goals/_index.json` to mark this goal `done`.
