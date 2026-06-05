---
id: G050
title: Counsellor Manager team heatmap dashboard (basic)
workflow: W1
deps: ["G031"]
size: M
status: not_started
owner: claude_code
---

# G050 — Counsellor Manager team heatmap dashboard (basic)

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G031
**Size:** M

## What

/counsellor-manager/team. Heatmap: per-counsellor pipeline depth, conversion rate, SLA breach status. Updates real-time.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Grid showing each counsellor: pipeline count, hot/warm/cold breakdown
2. Conversion rate (7d rolling) per counsellor
3. SLA breaches highlighted (red)
4. Updates within 5s of underlying changes
5. RBAC: own_team only

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G050` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G050: Counsellor Manager team heatmap dashboard (basic)"`
Update `goals/_index.json` to mark this goal `done`.
