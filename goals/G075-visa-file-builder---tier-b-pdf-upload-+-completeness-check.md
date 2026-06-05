---
id: G075
title: Visa file builder — Tier B PDF upload + completeness check
workflow: W3
deps: ["G073", "G074"]
size: L
status: not_started
owner: claude_code
---

# G075 — Visa file builder — Tier B PDF upload + completeness check

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G073, G074
**Size:** L

## What

Per visa file: upload each required filled PDF, system runs completeness check against per-country checklist.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Checklist visible with per-item upload slots
2. Drag-drop or click-to-upload
3. Completeness check after each upload: form present, correct version, signed (where required)
4. Progress meter: X of Y items complete
5. Per-item notes from ops
6. No field-level form filling — pure PDF management

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G075` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G075: Visa file builder — Tier B PDF upload + completeness check"`
Update `goals/_index.json` to mark this goal `done`.
