---
id: G150
title: SOP cross-app search
workflow: W6
deps: ["G135"]
size: M
status: not_started
owner: claude_code
---

# G150 — SOP cross-app search

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G135
**Size:** M

## What

Any user can search SOPs they have access to. Full-text search.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Search bar in nav
2. Full-text index of SOP block content (filtered by user role)
3. Results show: role, section, block type, snippet
4. Tap result → opens SOP in context
5. Latency ≤ 1s

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G150` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G150: SOP cross-app search"`
Update `goals/_index.json` to mark this goal `done`.
