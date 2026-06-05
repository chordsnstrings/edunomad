---
id: G052
title: Per-case view — pre-packaging audit
workflow: W2
deps: ["G051"]
size: M
status: not_started
owner: claude_code
---

# G052 — Per-case view — pre-packaging audit

**Workflow:** W2 (Application packaging through submission)
**Dependencies:** G051
**Size:** M

## What

Open case → profile, doc inventory, shortlist, counsellor notes, per-uni requirements in <2s.

## Why

This goal belongs to workflow W2 (Application packaging through submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Loads in <2s
2. Sections: profile summary, doc inventory with QA status, shortlist with rationale, counsellor notes, per-uni packaging requirements
3. Per-uni requirements loaded from universities.csv
4. Missing doc / failed QA items highlighted

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w2-application-packaging.md`
- `CLAUDE.md §6 (Operations)`

## Verification

Run `/verify G052` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G052: Per-case view — pre-packaging audit"`
Update `goals/_index.json` to mark this goal `done`.
