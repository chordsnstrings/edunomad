#!/usr/bin/env bash
# Daily Postgres backup (G179). Runs from the scheduled GitHub Action (or any
# cron). Dumps a custom-format archive and uploads it to S3-compatible object
# storage under a date-stamped key. Old backups are expired by the bucket's
# 30-day lifecycle policy (see docs/cc/backup-restore.md).
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL must be set}"
: "${BACKUP_BUCKET:?BACKUP_BUCKET (s3://bucket/prefix) must be set}"

STAMP="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
FILE="edunomad-${STAMP}.dump"
TMP="/tmp/${FILE}"

echo "[backup] dumping database -> ${TMP}"
pg_dump --format=custom --no-owner "$DATABASE_URL" > "$TMP"

echo "[backup] uploading -> ${BACKUP_BUCKET}/${FILE}"
# Uses awscli; endpoint override supports R2 / Spaces / MinIO.
AWS_ARGS=()
[ -n "${S3_ENDPOINT:-}" ] && AWS_ARGS+=(--endpoint-url "$S3_ENDPOINT")
aws "${AWS_ARGS[@]}" s3 cp "$TMP" "${BACKUP_BUCKET}/${FILE}"

# Write a "latest" pointer for the restore-test job.
echo "${FILE}" > /tmp/latest-backup.txt
aws "${AWS_ARGS[@]}" s3 cp /tmp/latest-backup.txt "${BACKUP_BUCKET}/latest.txt"

rm -f "$TMP"
echo "[backup] complete: ${FILE}"
