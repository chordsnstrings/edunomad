---
id: G095
title: Regulatory bulletin board (Compliance authoring)
workflow: W3
deps: []
size: M
status: not_started
owner: claude_code
---

# G095 — Regulatory bulletin board (Compliance authoring)

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** (none)
**Size:** M

## What

/compliance/bulletins. Compliance posts bulletins (regulatory change, form revision, fee change). System propagates to relevant data.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Bulletin entity with type, country, summary, effective_date
2. On publish: relevant data updates (e.g. form_repository, cost_components, destination_rules)
3. Affected open files flagged with banner
4. Audit log of bulletin publish
5. Bulletin history visible

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G095` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G095: Regulatory bulletin board (Compliance authoring)"`
Update `goals/_index.json` to mark this goal `done`.
