---
id: G153
title: SOP audit log of version views
workflow: W6
deps: ["G148"]
size: S
status: not_started
owner: claude_code
---

# G153 — SOP audit log of version views

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G148
**Size:** S

## What

Every time a user views a new SOP version, AuditLog entry.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. On 'SOP updated' banner dismiss: AuditLog entry
2. Reads (without dismissal) also logged at first view
3. Visible to Compliance + Super Admin for compliance audits

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G153` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G153: SOP audit log of version views"`
Update `goals/_index.json` to mark this goal `done`.
