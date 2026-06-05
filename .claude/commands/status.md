---
description: Progress snapshot — done / in-progress / blocked / not-started by workflow
allowed-tools: [Read, Bash, Glob]
---

# /status — Progress snapshot

You are producing a progress report across all 180 goals.

## Behaviour

1. Read `goals/_index.json`.
2. Group goals by `workflow` (W0 through W7).
3. For each workflow, count: `done`, `in_progress`, `blocked`, `not_started`.
4. Compute overall: total done / 180.
5. Compute critical path: first not-started goal with no remaining
   blocking deps in each workflow.
6. List all blocked goals with their `blocker_reason`.
7. If any goal has been `in_progress` for > 24h, flag it as STALE.

## Output format

```
EduNomad build status — 2026-06-05

Overall: 87 / 180 goals done (48%)

By workflow:
  W0 Foundations          12/12 done (100%)
  W1 Student onboarding   24/30 done (80%) — 1 in_progress, 5 not_started
  W2 Packaging            18/22 done (82%) — 2 blocked, 2 not_started
  W3 Visa file            12/28 done (43%) — 1 in_progress, 15 not_started
  W4 Parent               14/14 done (100%)
  W5 Counsellor manager    5/20 done (25%) — 15 not_started
  W6 SOP CMS               2/24 done (8%)  — 22 not_started
  W7 Compliance audit      0/15 done (0%)  — 15 not_started
  CC Cross-cutting         0/15 done (0%)  — 15 not_started

In progress:
  G078 — Visa file builder Tier B PDF upload (W3, started 4h ago)

Blocked (2):
  G041 — Stripe Bangladesh redirect failover
         Reason: BD merchant account credentials not provided yet
         Blocked since 2026-06-03
  G053 — IRCC portal scraper for daily status check
         Reason: IRCC ToS prohibits scraping; need alternate approach
         Blocked since 2026-06-04

Next unblocked goal: G079 — Visa file completeness check engine

Stale (none).
```

## Rules

- Compute, don't estimate. Read `_index.json` and produce real numbers.
- Show blocked goals prominently — these are the human's queue.
- Suggest the next single goal the user (or `/next`) should pick up.
