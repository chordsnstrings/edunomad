---
id: G147
title: SOP translation pipeline status per block
workflow: W6
deps: ["G137"]
size: M
status: not_started
owner: claude_code
---

# G147 — SOP translation pipeline status per block

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G137
**Size:** M

## What

Per block, per language (BN/HI/NE): translation status (missing/pending/translated/reviewed).

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. UI shows translation matrix per SOP
2. Per-block edit allows entering translations
3. Export missing translations to spreadsheet for translator
4. Import translations from spreadsheet
5. Block requires translation if it's customer-facing (script/template/FAQ) — gating publish

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G147` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G147: SOP translation pipeline status per block"`
Update `goals/_index.json` to mark this goal `done`.
