---
id: G083
title: Compliance sign-off UI — full file view
workflow: W3
deps: ["G080", "G011"]
size: L
status: not_started
owner: claude_code
---

# G083 — Compliance sign-off UI — full file view

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G080, G011
**Size:** L

## What

/compliance/queue → open visa file → full navigable view + per-country sign-off checklist + sign-off button.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Single navigable view of full file
2. Per-country sign-off checklist alongside file
3. Cross-doc consistency results visible
4. Misrepresentation flags visible with resolution status
5. Three actions: Sign / Return with annotations / Refuse
6. Annotation tool inline on docs
7. RBAC: compliance role only

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G083` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G083: Compliance sign-off UI — full file view"`
Update `goals/_index.json` to mark this goal `done`.
