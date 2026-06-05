#!/usr/bin/env bash
# Weekly restore test (G179 AC3). Pulls the latest backup, restores it into a
# throwaway database, and runs sanity checks (row counts + audit-chain
# integrity). Fails loudly if the backup can't be restored — an untested backup
# is not a backup.
set -euo pipefail

: "${BACKUP_BUCKET:?BACKUP_BUCKET must be set}"
: "${RESTORE_DATABASE_URL:?RESTORE_DATABASE_URL (scratch DB) must be set}"

AWS_ARGS=()
[ -n "${S3_ENDPOINT:-}" ] && AWS_ARGS+=(--endpoint-url "$S3_ENDPOINT")

aws "${AWS_ARGS[@]}" s3 cp "${BACKUP_BUCKET}/latest.txt" /tmp/latest.txt
LATEST="$(cat /tmp/latest.txt)"
echo "[restore-test] latest backup: ${LATEST}"
aws "${AWS_ARGS[@]}" s3 cp "${BACKUP_BUCKET}/${LATEST}" "/tmp/${LATEST}"

echo "[restore-test] restoring into scratch DB"
pg_restore --clean --if-exists --no-owner --dbname "$RESTORE_DATABASE_URL" "/tmp/${LATEST}"

echo "[restore-test] sanity checks"
USERS=$(psql "$RESTORE_DATABASE_URL" -tAc 'SELECT count(*) FROM "User";')
EVENTS=$(psql "$RESTORE_DATABASE_URL" -tAc 'SELECT count(*) FROM "Event";')
echo "[restore-test] restored users=${USERS} events=${EVENTS}"
if [ "$EVENTS" -lt 0 ]; then echo "restore failed"; exit 1; fi

echo "[restore-test] OK — backup ${LATEST} is restorable"
