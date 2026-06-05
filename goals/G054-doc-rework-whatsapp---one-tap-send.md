---
id: G054
title: Doc rework WhatsApp — one-tap send
workflow: W2
deps: ["G053", "G013"]
size: S
status: not_started
owner: claude_code
---

# G054 — Doc rework WhatsApp — one-tap send

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G053, G013
**Size:** S

## What

From QA rejection, one-tap send doc_rework template to student.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Template auto-fills doc_type and reason
2. Counsellor/ops can edit before send
3. Send creates Communication row + document.rework_requested event
4. Document status → rework_requested

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G054` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G054: Doc rework WhatsApp — one-tap send"`
Update `goals/_index.json` to mark this goal `done`.
