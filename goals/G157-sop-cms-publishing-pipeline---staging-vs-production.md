---
id: G157
title: SOP CMS publishing pipeline — staging vs production
workflow: W6
deps: ["G148"]
size: M
status: not_started
owner: claude_code
---

# G157 — SOP CMS publishing pipeline — staging vs production

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G148
**Size:** M

## What

SOPs publish to staging environment first, then to production after final review.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Two publish states: staging + production
2. Staging is reviewer-only visibility
3. Production publish requires explicit promotion + audit log entry
4. Rollback possible to previous production version

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G157` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G157: SOP CMS publishing pipeline — staging vs production"`
Update `goals/_index.json` to mark this goal `done`.
