---
id: G151
title: SOP checklist quality enforcement — runtime hooks
workflow: W6
deps: ["G141"]
size: M
status: not_started
owner: claude_code
---

# G151 — SOP checklist quality enforcement — runtime hooks

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G141
**Size:** M

## What

Runtime hooks at gates (shortlist lock, application packaging submit, visa file sign-off): check relevant SOP checklist before allowing.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Gates registered: shortlist_lock, application_submit, visa_file_signoff
2. Each gate looks up active checklist blocks
3. Failure: blocking modal with itemised failures
4. Success: proceed

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G151` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G151: SOP checklist quality enforcement — runtime hooks"`
Update `goals/_index.json` to mark this goal `done`.
