---
id: G184
title: Secret management
workflow: CC
deps: ["G180"]
size: S
status: not_started
owner: claude_code
---

# G184 — Secret management

**Workflow:** CC (Cross-cutting platform)
**Dependencies:** G180
**Size:** S

## What

All secrets in secret manager (env-specific). Never in code or .env in repo.

## Why

This goal belongs to workflow CC (Cross-cutting platform). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Secret manager integrated (chosen)
2. Env loading from secret manager at runtime
3. Repo has no secrets (validated by git-secrets or similar)
4. Rotation runbook in docs/

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md §10, §11`

## Verification

Run `/verify G184` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G184: Secret management"`
Update `goals/_index.json` to mark this goal `done`.
