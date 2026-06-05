---
description: Run acceptance checks on the current in-progress goal
argument-hint: "[G### to verify a specific goal] (no arg = current in-progress)"
allowed-tools: [Read, Bash, Glob, Grep]
---

# /verify — Acceptance check

You are verifying that the work for a goal meets its acceptance criteria.

## Behaviour

1. Determine which goal to verify:
   - If `$ARGUMENTS` is a goal id (e.g. `G023`), use that
   - Else read `goals/_index.json` and find the goal where
     `status == "in_progress"`. If multiple, fail and list them.
   - If none in progress and no arg, fail.

2. Open the goal file `goals/G###-*.md`. Read the `## Acceptance criteria`
   section.

3. For each criterion:
   - Determine how it can be verified (manual walkthrough, automated test,
     code inspection, API call, schema check, lighthouse audit, etc.).
   - Execute the verification.
   - Mark **PASS** or **FAIL** with the evidence.

4. Common verification methods:
   - **Code inspection** — read the relevant file(s) and confirm the
     behaviour matches the criterion
   - **Unit/integration test** — run via the project's test command
     (check `docs/00-stack-decisions.md` for the test runner)
   - **Manual walkthrough** — describe the user steps and what should
     happen at each
   - **Schema check** — read the migration / schema file
   - **API call** — use Bash + curl against the dev server
   - **Lighthouse / performance** — for budgets in CLAUDE.md Section 10

5. Output: a checklist with PASS/FAIL per criterion + summary line.

## Output format

```
Verifying G023 — Counsellor lead inbox with SOP right rail

[PASS] 1. Counsellor sees inbox at /counsellor/inbox with 3 tabs ...
       Evidence: src/app/counsellor/inbox/page.tsx lines 12-48 render
       three tab components.

[PASS] 2. Tapping a lead opens detail view within 200ms ...
       Evidence: Cypress test e2e/counsellor-inbox.cy.ts confirms
       transition in 142ms on cold cache.

[FAIL] 3. Right rail shows SOP intro script when student.first_call ==
       true ...
       Issue: Right rail renders but pulls from wrong SOP block. The
       block_id 'counsellor_intro' isn't being looked up; it's hardcoded
       to a placeholder.
       Where: src/components/CounsellorRightRail.tsx line 23.

Result: 2 of 3 PASS. Goal NOT ready for /goals done.
```

## Rules

- **Verification is not building.** If a criterion is FAIL, do not fix
  it in this command. Report and stop. Fixing is a separate step the
  user / next session does, after which `/verify` runs again.
- **Be specific about evidence.** Cite file paths, line numbers, command
  outputs, test names. Never just say "looks good."
- **Be honest about what you couldn't verify.** Some criteria need
  manual user testing (e.g. "feels mobile-native") — flag these as
  `[MANUAL]` not `[PASS]` and describe what the user should check.
- **Run actual tests.** If the project has a test command, run it. Don't
  reason about whether tests would pass — execute them.

## Special cases

- **Cross-cutting criteria** (e.g. accessibility, performance budgets)
  may not be testable per-goal but are testable at workflow milestones.
  Note them as `[DEFERRED to workflow checkpoint]` rather than re-running
  every goal.
- **Manual-only criteria** (e.g. "feels warm and trustworthy") get
  `[MANUAL]` with a specific check the human should perform.
- **Database state criteria** require checking actual data. Run queries
  via the project's psql / db CLI.
