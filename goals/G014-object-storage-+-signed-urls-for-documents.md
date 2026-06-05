---
id: G014
title: Object storage + signed URLs for documents
workflow: W0
deps: ["G001"]
size: M
status: not_started
owner: claude_code
---

# G014 — Object storage + signed URLs for documents

**Workflow:** W0 (Foundations)
**Dependencies:** G001
**Size:** M

## What

S3-compatible storage. Binary in storage; metadata in DB. Signed URL 15-min expiry.

## Why

This goal belongs to workflow W0 (Foundations). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Storage credentials in env vars
2. Upload helper accepts buffer + key + content-type, returns storage_key
3. Download via signed URL with 15-min expiry
4. Direct browser upload via presigned PUT URL for large files
5. Document binary never appears in logs
6. Stack decision logged

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `CLAUDE.md`
- `docs/01-data-model.md`

## Verification

Run `/verify G014` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G014: Object storage + signed URLs for documents"`
Update `goals/_index.json` to mark this goal `done`.
