---
id: G002
title: Postgres setup with chosen ORM
workflow: W0
deps: ["G001"]
size: M
status: not_started
owner: claude_code
---

# G002 — Postgres setup with chosen ORM

**Workflow:** W0 (Foundations)
**Dependencies:** G001
**Size:** M

## What

Add Postgres with your preferred ORM/query builder. Local dev DB, migrations, seed scripts.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Local dev DB connects via env vars
2. Migration framework set up; `npm run db:migrate` runs
3. Seed script runs without error
4. Test DB isolated from dev DB
5. Stack decision logged

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G002` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G002: Postgres setup with chosen ORM"`
Update `goals/_index.json` to mark this goal `done`.
