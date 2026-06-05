---
id: G135
title: SOP entity + block storage
workflow: W6
deps: ["G002"]
size: M
status: not_started
owner: claude_code
---

# G135 — SOP entity + block storage

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G002
**Size:** M

## What

SOP and SOPBlock entities. Each block has type, content, ordering, translations.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. SOP: id, role, version, status (draft/published/archived), owner, reviewer
2. SOPBlock: id, sop_id, ordinal, type, content (jsonb), translations (jsonb per lang)
3. Migration runs
4. Indexes for SOP retrieval

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G135` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G135: SOP entity + block storage"`
Update `goals/_index.json` to mark this goal `done`.
