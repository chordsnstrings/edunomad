---
id: G041
title: Document upload — mobile camera + auto-crop
workflow: W1
deps: ["G040"]
size: M
status: not_started
owner: claude_code
---

# G041 — Document upload — mobile camera + auto-crop

**Workflow:** W1 (Student onboarding through shortlist lock)
**Dependencies:** G040
**Size:** M

## What

Upload screen: camera capture or file picker. Auto-crop for camera. ≤10MB.

## Why

This goal belongs to workflow W1 (Student onboarding through shortlist lock). See the workflow doc for upstream/downstream context.

## Acceptance criteria

1. Camera capture button opens device camera
2. Auto-crop snaps document edges (use a library like documentscanner)
3. File picker accepts PDF/JPG/PNG up to 10MB
4. Preview before upload
5. Upload progress bar; uses presigned URL
6. On success: document.uploaded event; goes to under_review status

## Out of scope

Anything not listed in acceptance criteria. Adjacent functionality is covered by other goals — don't gold-plate.

## References

- `docs/04-workflows/w1-student-onboarding.md`
- `CLAUDE.md §6 (Counsellor, Student)`

## Verification

Run `/verify G041` after building. Each acceptance criterion must PASS or `[MANUAL]` with the required check noted.

Verification methods to consider:
- Code inspection for structural criteria
- Unit / integration tests for logic criteria
- Manual walkthrough for UX criteria
- Lighthouse / synthetic tests for performance criteria
- Database queries for data-state criteria

## Commit

When done: `git commit -m "G041: Document upload — mobile camera + auto-crop"`
Update `goals/_index.json` to mark this goal `done`.
