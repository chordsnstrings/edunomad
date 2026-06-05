---
id: G163
title: Regulator inquiry workflow — evidence packet assembly
workflow: W7
deps: ["G160"]
size: M
status: not_started
owner: claude_code
---

# G163 — Regulator inquiry workflow — evidence packet assembly

**Workflow:** W7 (Compliance audit trail and incident response)
**Dependencies:** G160
**Size:** M

## What

Education Manager flags inquiry → Compliance + Super Admin build evidence packet → response window SLA timer.

## Why

This goal belongs to workflow W7 (Compliance audit trail and incident response). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. RegulatorInquiry entity: country, body, summary, response_deadline
2. Compliance assembles: audit log subset + visa file dossiers + role assignments + training records
3. SLA timer based on response_deadline
4. Status: open / drafting / awaiting_counsel / dispatched / closed

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w7-compliance-audit.md`

## Verification

Run `/verify G163` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G163: Regulator inquiry workflow — evidence packet assembly"`
Update `goals/_index.json` to mark this goal `done`.
