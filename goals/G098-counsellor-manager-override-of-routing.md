---
id: G098
title: Counsellor Manager override of routing
workflow: W3
deps: ["G029"]
size: S
status: not_started
owner: claude_code
---

# G098 — Counsellor Manager override of routing

**Workflow:** W3 (Visa file preparation, sign-off, submission)
**Dependencies:** G029
**Size:** S

## What

(Out-of-workflow but adjacent) Manager can override auto-routing for VIP / agent-priority / capacity rebalancing.

## Why

This goal belongs to workflow W3 (Visa file preparation, sign-off, submission). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Manager sees current routing decisions per overnight batch
2. Override action: reassign lead to specific counsellor
3. counsellor.reassigned event with reason
4. RBAC: own_team

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w3-visa-file.md`
- `docs/05-reference/destination-rules.md`
- `CLAUDE.md §6 (Compliance)`

## Verification

Run `/verify G098` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G098: Counsellor Manager override of routing"`
Update `goals/_index.json` to mark this goal `done`.
