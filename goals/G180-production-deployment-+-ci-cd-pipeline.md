---
id: G180
title: Production deployment + CI/CD pipeline
workflow: CC
deps: ["G001", "G002"]
size: L
status: not_started
owner: claude_code
---

# G180 — Production deployment + CI/CD pipeline

**Workflow:** CC (Cross-cutting platform)
**Dependencies:** G001, G002
**Size:** L

## What

Production deployment. CI/CD on main branch. Migration runner. Env separation.

## Why

This goal belongs to workflow CC (Cross-cutting platform). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Production env separate from staging
2. CI runs: lint, test, type-check, build
3. CD: auto-deploy main to staging; manual promote to production
4. Migrations run automatically on deploy with safety rollback
5. Secrets in secret manager (env-specific)
6. Stack decision logged

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md §10, §11`

## Verification

Run `/verify G180` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G180: Production deployment + CI/CD pipeline"`
Update `goals/_index.json` to mark this goal `done`.
