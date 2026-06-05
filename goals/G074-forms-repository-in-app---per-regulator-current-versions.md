---
id: G074
title: Forms repository in app — per regulator current versions
workflow: W3
deps: ["G014"]
size: M
status: not_started
owner: claude_code
---

# G074 — Forms repository in app — per regulator current versions

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G014
**Size:** M

## What

/admin/forms repo. Compliance uploads current regulator forms; ops downloads.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Forms list per destination (CA: IMM 1294, IMM 5709, IMM 5645; UK: equivalent; etc.)
2. Each form: current_version (YYYY-MM), regulator_url, pdf in storage
3. Compliance can upload new version + supersede old
4. Old versions retained but marked superseded
5. Affected open visa files flagged when new version published

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G074` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G074: Forms repository in app — per regulator current versions"`
Update `goals/_index.json` to mark this goal `done`.
