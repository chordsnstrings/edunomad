---
id: G152
title: SOP KPI engine — live values to dashboards
workflow: W6
deps: ["G142"]
size: M
status: not_started
owner: claude_code
---

# G152 — SOP KPI engine — live values to dashboards

**Workflow:** W6 (SOP authoring and publishing)
**Dependencies:** G142
**Size:** M

## What

Metrics service powering KPI blocks. Computes live values from underlying data.

## Why

This goal belongs to workflow W6 (SOP authoring and publishing). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Metric registry: name, computation, refresh interval
2. Initial metrics: lead_to_application_conversion, sla_breach_rate, qa_score_avg, refund_rate, visa_approval_rate
3. Cached values with TTL per metric
4. KPI block renders live value + target + direction

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w6-sop-cms.md`
- `CLAUDE.md §8`

## Verification

Run `/verify G152` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G152: SOP KPI engine — live values to dashboards"`
Update `goals/_index.json` to mark this goal `done`.
