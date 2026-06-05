---
id: G001
title: Repo scaffold with chosen stack
workflow: W0
deps: []
size: M
status: not_started
owner: claude_code
---

# G001 — Repo scaffold with chosen stack

**Workflow:** W0 (Foundations)
**Dependencies:** (none)
**Size:** M

## What

Create the project scaffold using your preferred framework + tooling. Set up package manager, TypeScript config, linting, formatting, test runner. Lock decisions in docs/00-stack-decisions.md.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Project initialises with single command (e.g. `npm install && npm run dev`)
2. Linter and formatter run via npm scripts
3. TypeScript strict mode on
4. Test runner runs an empty test successfully
5. docs/00-stack-decisions.md updated with framework + tooling choices and rationale

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G001` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G001: Repo scaffold with chosen stack"`
Update `goals/_index.json` to mark this goal `done`.
