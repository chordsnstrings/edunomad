---
id: G079
title: Per-country checklist regulatory updates flow
workflow: W3
deps: ["G074"]
size: M
status: not_started
owner: claude_code
---

# G079 — Per-country checklist regulatory updates flow

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G074
**Size:** M

## What

When Compliance posts a regulatory bulletin marking a form as superseded, affected open visa files show banner.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Bulletin entity: type, country, form_id, summary, effective_date
2. On bulletin publish: query open visa files affected → mark with banner
3. Banner: 'IMM 1294 has been revised. Re-download and re-attach the new version.'
4. Ops can dismiss after re-attaching

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G079` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G079: Per-country checklist regulatory updates flow"`
Update `goals/_index.json` to mark this goal `done`.
