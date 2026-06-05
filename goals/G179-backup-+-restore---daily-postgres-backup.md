---
id: G179
title: Backup + restore — daily Postgres backup
workflow: CC
deps: ["G002"]
size: M
status: not_started
owner: claude_code
---

# G179 — Backup + restore — daily Postgres backup

**Workflow:** CC (Cross-cutting platform)
**Dependencies:** G002
**Size:** M

## What

Daily backups. Weekly restore test on staging. PITR up to 7 days.

## Why

This goal belongs to workflow CC (Cross-cutting platform). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Daily backup job runs
2. Backups stored in object storage with 30-day retention
3. Weekly automated restore test on staging
4. PITR available via DB provider or pg_basebackup
5. Recovery runbook in docs/

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md §10, §11`

## Verification

Run `/verify G179` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G179: Backup + restore — daily Postgres backup"`
Update `goals/_index.json` to mark this goal `done`.
