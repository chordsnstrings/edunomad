---
id: G144
title: SOP block type — trigger_rule (declarative surfacing)
workflow: W6
deps: ["G137"]
size: M
status: not_started
owner: claude_code
---

# G144 — SOP block type — trigger_rule (declarative surfacing)

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G137
**Size:** M

## What

Trigger rule: declarative when/if/surface/show. Drives contextual snippets across product.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Editor: when (event type), if (DSL condition), surface (target), show (sop_block reference)
2. Engine evaluates rules continuously
3. Matching rules surface blocks in target areas
4. Latency ≤ 500ms

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G144` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G144: SOP block type — trigger_rule (declarative surfacing)"`
Update `goals/_index.json` to mark this goal `done`.
