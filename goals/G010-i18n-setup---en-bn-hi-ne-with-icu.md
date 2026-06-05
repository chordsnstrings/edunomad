---
id: G010
title: i18n setup — EN/BN/HI/NE with ICU
workflow: W0
deps: ["G001"]
size: M
status: not_started
owner: claude_code
---

# G010 — i18n setup — EN/BN/HI/NE with ICU

**Workflow:** W0 (Foundations)
**Dependencies:** G001
**Size:** M

## What

i18n library with ICU. EN source-of-truth. BN/HI/NE fallback to EN. Every visible string keyed.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Library installed; config files for EN/BN/HI/NE
2. EN strings populated from docs/05-reference/ui-microcopy.md
3. BN/HI/NE fallback to EN when key missing
4. ICU plurals work
5. Locale auto-detected from device; manual override
6. Date/currency formatting locale-aware

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G010` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G010: i18n setup — EN/BN/HI/NE with ICU"`
Update `goals/_index.json` to mark this goal `done`.
