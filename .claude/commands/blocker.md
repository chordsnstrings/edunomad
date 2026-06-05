---
description: Log a blocker on the current goal with full context, escalate to human
argument-hint: "<reason — why you're stuck>"
allowed-tools: [Read, Write, Edit]
---

# /blocker — Escalate the current goal

Use this when the current in-progress goal cannot be completed without
human input.

## Behaviour

1. Find the in-progress goal in `goals/_index.json`. If none, ask which
   goal is blocked.
2. Capture the blocker reason from `$ARGUMENTS`. If missing, ask the
   user for it before proceeding.
3. Update `_index.json`:
   - `status: blocked`
   - `blocker_reason: <reason>`
   - `blocked_at: <ISO timestamp now>`
4. Produce a structured escalation note:

```
ESCALATION — G078 (Visa file builder Tier B PDF upload)

Blocker: <reason>

What I tried:
  - [list each approach you took]

What's needed:
  - A concrete decision, library choice, credential, doc, etc.

Acceptance criteria affected:
  - [which numbered criteria are now blocked]

Suggested unblocking actions:
  - [option A, option B, with tradeoffs]

Next goal I could work on instead:
  G079 — <title>
  G080 — <title>
```

5. Print the escalation to the user.

## When to use /blocker

- A goal requires a credential / API key not in env (e.g. WhatsApp Cloud
  API not yet provisioned, payment gateway sandbox not approved)
- A goal references a doc/spec that contradicts another
- A goal seems to violate a non-negotiable constraint in `CLAUDE.md` §1
- A regulatory rule is unclear and you'd be guessing
- A library/service the goal assumes isn't available or has changed
- You've spent 2x estimated `size` on the goal without converging

## Rules

- **Don't escalate prematurely.** First, re-read the goal, check
  references, search the codebase for an existing pattern.
- **Be specific about what unblocks you.** "I need X decision" beats
  "this is hard."
- **Suggest alternatives.** Always propose 2 options where possible.
- **Move on.** After logging the blocker, suggest the next unblocked
  goal so progress continues.
