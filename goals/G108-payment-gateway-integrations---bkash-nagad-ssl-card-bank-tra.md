---
id: G108
title: Payment gateway integrations — bKash, Nagad, SSL, card, bank transfer
workflow: W4
deps: ["G107"]
size: L
status: not_started
owner: claude_code
---

# G108 — Payment gateway integrations — bKash, Nagad, SSL, card, bank transfer

**Workflow:** W4 (Parent visibility and financial approval)
**Dependencies:** G107
**Size:** L

## What

Integrate the 5 payment methods. Each as a payment provider adapter.

## Why

This goal belongs to workflow W4 (Parent visibility and financial approval). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Adapter pattern: each method implements pay(invoice) → result
2. bKash sandbox integration
3. Nagad sandbox integration
4. SSL Commerz sandbox integration (covers card + bank transfer in BD)
5. Stripe for international card
6. Each method has its own redirect/webhook flow handled
7. Receipts captured + linked to Payment row

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w4-parent-visibility.md`
- `docs/05-reference/parent-faq.md`

## Verification

Run `/verify G108` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G108: Payment gateway integrations — bKash, Nagad, SSL, card, bank transfer"`
Update `goals/_index.json` to mark this goal `done`.
