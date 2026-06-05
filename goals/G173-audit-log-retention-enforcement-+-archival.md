---
id: G173
title: Audit log retention enforcement + archival
workflow: W7
deps: ["G007"]
size: M
status: not_started
owner: claude_code
---

# G173 — Audit log retention enforcement + archival

**Workflow:** W7 (Compliance audit trail and incident response)
**Dependencies:** G007
**Size:** M

## What

After 6 years: oldest entries archived to cold storage (still retrievable, not in hot DB).

## Why

This goal belongs to workflow W7 (Compliance audit trail and incident response). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Retention policy: 6 years hot, then archive
2. Archive job runs monthly
3. Archived entries: storage_key in cold storage, metadata in hot DB
4. Restore action available for Compliance

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w7-compliance-audit.md`

## Verification

Run `/verify G173` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G173: Audit log retention enforcement + archival"`
Update `goals/_index.json` to mark this goal `done`.
