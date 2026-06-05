---
id: G107
title: Payment approval modal — Parent flow
workflow: W4
deps: ["G103"]
size: L
status: not_started
owner: claude_code
---

# G107 — Payment approval modal — Parent flow

**Workflow:** W4 (Parent visibility and financial approval)
**Dependencies:** G103
**Size:** L

## What

Parent receives invoice → opens modal: amount, purpose, destination, refund policy, payment options. Two-tap approve.

## Why

This goal belongs to workflow W4 (Parent visibility and financial approval). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Triggered by payment.invoice_issued event
2. Modal renders invoice details + refund policy + 5+ payment options
3. Currency display: BDT/INR/NPR + USD equivalent
4. Tap method → tap Approve → 2nd tap Confirm → payment processed
5. On success: payment.received event + receipt visible immediately

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w4-parent-visibility.md`
- `docs/05-reference/parent-faq.md`

## Verification

Run `/verify G107` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G107: Payment approval modal — Parent flow"`
Update `goals/_index.json` to mark this goal `done`.
