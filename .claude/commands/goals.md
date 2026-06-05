---
description: Manage the goal queue — see remaining, pick next, mark done, escalate blockers
argument-hint: "[next | show <id> | done <id> | block <id> '<reason>'] (no arg = show top 5)"
allowed-tools: [Read, Write, Edit, Bash, Glob]
---

# /goals — Goal queue orchestrator

You are managing the goal queue for the EduNomad build. Goals live in
`goals/G###-*.md` files. The machine-readable index is `goals/_index.json`.

## Arguments

Parse `$ARGUMENTS`:
- **Empty** → show top 5 unblocked goals + currently in-progress
- **`next`** → pick the next unblocked goal, open its file, propose a plan
- **`show G###`** → display the goal file in full
- **`done G###`** → mark done in `_index.json`, commit, move on
- **`block G### "reason"`** → mark blocked with reason, surface to user

## Behaviour by argument

### Empty (default — overview)

1. Read `goals/_index.json`.
2. Show: in-progress (if any), then top 5 `not_started` goals whose
   dependencies are all `done`.
3. Format as a table with columns: id | title | workflow | size | deps.
4. End with: "Run `/goals next` to start the next one."

### `next` — pick and plan

1. Read `goals/_index.json`.
2. Find the first goal where `status == "not_started"` and all `deps`
   are `done`. If none, say so and stop.
3. Open `goals/G###-*.md`. Read it fully, including referenced docs
   under `## References`.
4. Update `_index.json` to set this goal's status to `in_progress`.
5. **Propose a plan** before writing any code:
   - Files you'll touch (existing) and files you'll create (new)
   - Schema changes if any
   - Tests you'll write
   - Approximate order of operations
6. Wait for user confirmation on the plan unless the goal is `size: XS`
   (then proceed and report).
7. Build. Run tests. Run `/verify`.
8. If verify passes, run `/goals done G###` to complete.

### `show G###` — display

1. Read `goals/G###-*.md`. If multiple matches, pick the exact id match.
2. Print the file as-is.
3. Read its references and show their relevant excerpts beneath.

### `done G###` — complete

1. Run `/verify` first if not already passing. If fail, refuse and explain.
2. Update `goals/_index.json`: set status to `done`, set `completed_at`
   to current ISO timestamp.
3. Stage all changes including `_index.json`.
4. Commit with message: `G###: <goal title>`.
5. Print: completion confirmation, next unblocked goal suggestion.

### `block G### "reason"` — escalate

1. Update `goals/_index.json`: set status to `blocked`, set
   `blocker_reason` to the provided string, set `blocked_at` to now.
2. Print a clear escalation note to the user including:
   - What you tried
   - What's blocking
   - What a human needs to decide / provide
3. Suggest the next unblocked goal you could work on instead.

## Output formatting

Use markdown tables for lists. Use code blocks for goal file content.
Be terse — these are status commands, not essays.

## Rules

- Never mark `done` without `/verify` passing
- Never skip dependencies even if a later goal looks more interesting
- Never edit the goal file itself when marking status — that lives in `_index.json`
- Never propose a plan that violates the constraints in `CLAUDE.md` Section 1
- When the in-progress goal seems wrong or already done, ask before resetting
