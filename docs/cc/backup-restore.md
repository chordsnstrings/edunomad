# Backup & restore runbook (G179)

## Policy

- **Daily** full logical backup (`pg_dump` custom format) → object storage.
- **30-day** retention via the bucket lifecycle policy.
- **Weekly** automated restore test into a throwaway database (an untested
  backup is not a backup).
- **PITR** up to 7 days via the managed Postgres provider's continuous WAL
  archiving (Neon / RDS / Supabase) — or `pg_basebackup` + WAL shipping if
  self-hosted.

## Schedule — `.github/workflows/backup.yml`

| Job | Cron (UTC) | Action |
|---|---|---|
| `daily-backup` | `0 2 * * *` | `scripts/backup.sh` → `s3://…/edunomad-<ts>.dump` + `latest.txt` |
| `weekly-restore-test` | `0 3 * * 0` | `scripts/restore-test.sh` → restore latest into scratch DB + sanity checks |

Required Environment secrets: `DATABASE_URL`, `BACKUP_BUCKET`, `S3_ENDPOINT`
(for R2/Spaces/MinIO), `BACKUP_AWS_ACCESS_KEY_ID`, `BACKUP_AWS_SECRET_ACCESS_KEY`.

## Recovery procedure

1. **Identify the target.** PITR for "as of a timestamp"; a daily dump for a
   whole-DB roll-back.
2. **PITR (preferred, ≤7 days):** in the provider console, restore the cluster to
   the chosen timestamp into a NEW instance. Never restore in place.
3. **From a daily dump:**
   ```bash
   aws s3 cp "$BACKUP_BUCKET/edunomad-<ts>.dump" /tmp/restore.dump
   createdb edunomad_restore
   pg_restore --clean --if-exists --no-owner \
     --dbname "postgresql://…/edunomad_restore" /tmp/restore.dump
   node prisma/harden.mjs   # re-apply append-only triggers
   ```
4. **Verify integrity.** Run the audit/event chain verifiers
   (`verifyAuditChain` / `verifyEventChain`, surfaced at `/admin/audit`) — the
   hash chain must report **intact** before the restore is promoted.
5. **Cut over** by repointing `DATABASE_URL` to the restored instance, then
   redeploy.

## Retention vs. backups

Backups are operational (30-day). They are **separate** from the 6-year
append-only audit/event retention (CLAUDE.md §1.5), which lives in the primary
DB and is archived to cold storage by `POST /api/cron/retention` — never deleted.
