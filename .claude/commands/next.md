---
description: Pick and start the next unblocked goal (alias for /goals next)
allowed-tools: [Read, Write, Edit, Bash, Glob]
---

# /next — Start next goal

Invoke `/goals next` behaviour. This exists as a shortcut.

Steps:

1. Read `goals/_index.json`.
2. Find the first goal where `status == "not_started"` AND all `deps`
   are `done`. If none, report it.
3. Open `goals/G###-*.md`. Read it including referenced docs.
4. Update `_index.json` to set status `in_progress`, `started_at` now.
5. Propose a plan (files touched, files new, schema, tests, order).
6. Wait for user confirmation unless goal is `size: XS`.
7. Build to the acceptance criteria.
8. Run `/verify`.
9. If pass, run `/goals done G###`.

If the in-progress slot is already taken by another goal, ask the user
whether to switch.
