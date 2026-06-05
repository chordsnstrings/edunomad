---
id: G017
title: Event template rendering with i18n
workflow: W0
deps: ["G005", "G010"]
size: S
status: not_started
owner: claude_code
---

# G017 — Event template rendering with i18n

**Workflow:** W0 (Foundations)
**Dependencies:** G005, G010
**Size:** S

## What

Resolve template by event.type + recipient.language. Variable substitution from event.payload.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. renderEventTemplate(event, language) returns rendered string
2. Templates loaded from event catalog config
3. Variable substitution via ICU
4. Falls back to EN if target template empty
5. Plural rules work

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G017` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G017: Event template rendering with i18n"`
Update `goals/_index.json` to mark this goal `done`.
