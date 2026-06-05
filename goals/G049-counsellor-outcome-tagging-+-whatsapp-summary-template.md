---
id: G049
title: Counsellor outcome tagging + WhatsApp summary template
workflow: W1
deps: ["G035", "G033"]
size: S
status: not_started
owner: claude_code
---

# G049 — Counsellor outcome tagging + WhatsApp summary template

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G035, G033
**Size:** S

## What

After call, counsellor tags outcome and one-taps close-call summary template via WhatsApp.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Outcome picker: warm / cold / qualified / hot
2. Close-call template auto-fills from call notes + decisions
3. Counsellor reviews/edits then sends
4. Outcome stored on Communication; affects lead_score recompute

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G049` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G049: Counsellor outcome tagging + WhatsApp summary template"`
Update `goals/_index.json` to mark this goal `done`.
