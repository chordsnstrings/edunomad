---
id: G136
title: SOP CMS — list view
workflow: W6
deps: ["G135"]
size: S
status: not_started
owner: claude_code
---

# G136 — SOP CMS — list view

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G135
**Size:** S

## What

/admin/sop. Lists all SOPs with owner, reviewer, last-published, translation status.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Table view of all SOPs
2. Columns: role, owner, reviewer, version, status, translation_pct
3. Filterable by role / status
4. RBAC: managers see SOPs they own + view all

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G136` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G136: SOP CMS — list view"`
Update `goals/_index.json` to mark this goal `done`.
