---
id: G053
title: Document QA tool — 30-item rubric per type
workflow: W2
deps: ["G052"]
size: L
status: not_started
owner: claude_code
---

# G053 — Document QA tool — 30-item rubric per type

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G052
**Size:** L

## What

Per document, 30-item QA rubric checklist. Approve / reject / rework with reason.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. 30 items per doc type (passport, transcript, IELTS, financials, photos, etc.)
2. Auto-fail conditions visible (e.g. validity < 6 months)
3. Three actions: approve, reject (with reason), rework (with reason + templated WhatsApp draft)
4. On rework: docs/05-reference/whatsapp-templates.md doc_rework template
5. On approve: document.approved event

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G053` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G053: Document QA tool — 30-item rubric per type"`
Update `goals/_index.json` to mark this goal `done`.
