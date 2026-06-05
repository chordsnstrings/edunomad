---
id: G137
title: SOP CMS — editor with block types
workflow: W6
deps: ["G135"]
size: L
status: not_started
owner: claude_code
---

# G137 — SOP CMS — editor with block types

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G135
**Size:** L

## What

Block-typed editor: paragraph, heading, list, table, script, template, decision_tree, checklist, kpi, compliance_warning, trigger_rule.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Block picker UI
2. Each block type has dedicated editor component
3. Drag-reorder blocks
4. Save per block
5. Preview render alongside editor
6. All 11 block types working

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G137` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G137: SOP CMS — editor with block types"`
Update `goals/_index.json` to mark this goal `done`.
