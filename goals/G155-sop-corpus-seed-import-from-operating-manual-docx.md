---
id: G155
title: SOP corpus seed import from operating manual docx
workflow: W6
deps: ["G135"]
size: L
status: not_started
owner: claude_code
---

# G155 — SOP corpus seed import from operating manual docx

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G135
**Size:** L

## What

Tool: import the EduNomad Operating Manual (.docx) into SOP corpus as initial seed.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Importer reads docx structure (headings → sections, lists → blocks)
2. Per-role detection from doc structure
3. Block-type inference from content patterns (code blocks → script/template)
4. Imported as draft; managers review and publish
5. Translation status = missing for non-EN languages

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G155` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G155: SOP corpus seed import from operating manual docx"`
Update `goals/_index.json` to mark this goal `done`.
