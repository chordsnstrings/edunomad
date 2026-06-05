---
id: G048
title: Lead score computation + display
workflow: W1
deps: ["G026"]
size: M
status: not_started
owner: claude_code
---

# G048 — Lead score computation + display

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G026
**Size:** M

## What

Compute lead_score from profile + behaviour signals. Visible to counsellor on lead detail.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Score 0-100 based on: profile completeness (30), English readiness (15), budget realism (20), destination clarity (10), intake urgency (10), source quality (15)
2. Recomputed on profile change
3. Score badge visible on counsellor cards (with breakdown on hover/tap)
4. Test: known good profile scores > 80; known weak profile < 40

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G048` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G048: Lead score computation + display"`
Update `goals/_index.json` to mark this goal `done`.
