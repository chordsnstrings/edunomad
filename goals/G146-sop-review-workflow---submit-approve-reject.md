---
id: G146
title: SOP review workflow — submit/approve/reject
workflow: W6
deps: ["G145"]
size: M
status: not_started
owner: claude_code
---

# G146 — SOP review workflow — submit/approve/reject

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G145
**Size:** M

## What

Owner submits draft → Reviewer (named in SOP) approves / rejects / requests changes.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Submit action: owner sends to reviewer
2. Reviewer notification
3. Reviewer view: side-by-side current vs proposed
4. Three actions: approve / reject / request changes
5. Status transitions enforced
6. Only approved versions can publish

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G146` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G146: SOP review workflow — submit/approve/reject"`
Update `goals/_index.json` to mark this goal `done`.
