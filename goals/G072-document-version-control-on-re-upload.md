---
id: G072
title: Document version control on re-upload
workflow: W2
deps: ["G041"]
size: S
status: not_started
owner: claude_code
---

# G072 — Document version control on re-upload

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G041
**Size:** S

## What

Re-uploading a document creates new version; old retained.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Document.version increments
2. Old version retained in storage; new version is 'current'
3. Version history visible on doc detail
4. Submitted documents (used in submitted application) cannot be edited — only superseded with new doc

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G072` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G072: Document version control on re-upload"`
Update `goals/_index.json` to mark this goal `done`.
