---
id: G058
title: Per-uni packaging tool — drag-drop assembler
workflow: W2
deps: ["G052"]
size: L
status: not_started
owner: claude_code
---

# G058 — Per-uni packaging tool — drag-drop assembler

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G052
**Size:** L

## What

For each programme on shortlist, assemble packet. Drag docs from vault, generate cover letter, generate single-PDF preview.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Per-uni checklist (from universities.csv)
2. Drag-drop from doc vault to checklist slot
3. Auto-generate cover letter from template + student data
4. Application fee payment integration where required
5. Generate packet PDF preview
6. application.packaged event on complete

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G058` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G058: Per-uni packaging tool — drag-drop assembler"`
Update `goals/_index.json` to mark this goal `done`.
