---
id: G185
title: Logging — structured, no PII at INFO
workflow: CC
deps: ["G001"]
size: S
status: not_started
owner: claude_code
---

# G185 — Logging — structured, no PII at INFO

**Workflow:** CC (Cross-cutting platform)
**Dependencies:** G001
**Size:** S

## What

Structured JSON logs. No PII at INFO level. Document binary never logged.

## Why

This goal belongs to workflow CC (Cross-cutting platform). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Logger emits JSON
2. PII redaction at INFO; full at DEBUG (off in prod)
3. Document upload paths never log binary content
4. Log aggregation service integrated

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md §10, §11`

## Verification

Run `/verify G185` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G185: Logging — structured, no PII at INFO"`
Update `goals/_index.json` to mark this goal `done`.
