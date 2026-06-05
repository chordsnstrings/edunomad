---
id: G148
title: SOP publish + 'SOP updated' banner to affected users
workflow: W6
deps: ["G146"]
size: M
status: not_started
owner: claude_code
---

# G148 — SOP publish + 'SOP updated' banner to affected users

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G146
**Size:** M

## What

On publish: affected role users see banner on next login + diff view.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Affected roles computed from SOP.role
2. Banner: 'SOP updated. See what changed.'
3. Diff view inline
4. User dismisses → AuditLog entry capturing version viewed

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G148` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G148: SOP publish + 'SOP updated' banner to affected users"`
Update `goals/_index.json` to mark this goal `done`.
