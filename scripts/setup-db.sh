#!/usr/bin/env bash
# Idempotent local Postgres provisioning for EduNomad.
# Safe to run repeatedly (e.g. from a Claude Code SessionStart hook): it starts
# Postgres if needed, ensures the role/db exist, writes a dev .env if missing,
# pushes the schema, and seeds only when the database is empty.
set -uo pipefail

PGBIN=/usr/lib/postgresql/16/bin
DATA=/var/lib/postgresql/edunomad
PORT=5432
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

log() { echo "[setup-db] $*"; }

# 1) Write a local dev .env if one isn't present (kept out of git).
if [ ! -f .env ]; then
  cat > .env <<'EOF'
DATABASE_URL="postgresql://edunomad:edunomad@localhost:5432/edunomad?schema=public"
AUTH_SECRET="dev-only-insecure-secret-change-me-in-production-0000000000"
ADMIN_EMAIL="admin@edunomad.app"
ADMIN_PASSWORD="ChangeMe!123"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
EOF
  log "wrote dev .env"
fi

# 2) Start Postgres if it isn't already accepting connections.
if ! "$PGBIN/pg_isready" -h localhost -p "$PORT" -q 2>/dev/null; then
  if [ ! -d "$DATA/base" ]; then
    log "initialising Postgres cluster"
    mkdir -p "$DATA"
    chown -R postgres:postgres "$DATA"
    sudo -u postgres "$PGBIN/initdb" -D "$DATA" -U postgres \
      --auth=trust --auth-host=trust >/dev/null 2>&1
  fi
  log "starting Postgres"
  sudo -u postgres "$PGBIN/pg_ctl" -D "$DATA" -l /tmp/pg.log \
    -o "-c listen_addresses='localhost' -p $PORT -c unix_socket_directories='/tmp'" \
    -w start >/dev/null 2>&1
fi

# 3) Ensure the app role and database exist.
HAS_ROLE=$(sudo -u postgres "$PGBIN/psql" -h localhost -p "$PORT" -U postgres -tAc \
  "SELECT 1 FROM pg_roles WHERE rolname='edunomad'" 2>/dev/null)
if [ "$HAS_ROLE" != "1" ]; then
  sudo -u postgres "$PGBIN/psql" -h localhost -p "$PORT" -U postgres -c \
    "CREATE ROLE edunomad WITH LOGIN PASSWORD 'edunomad' SUPERUSER;" >/dev/null 2>&1
fi
HAS_DB=$(sudo -u postgres "$PGBIN/psql" -h localhost -p "$PORT" -U postgres -tAc \
  "SELECT 1 FROM pg_database WHERE datname='edunomad'" 2>/dev/null)
if [ "$HAS_DB" != "1" ]; then
  sudo -u postgres "$PGBIN/createdb" -h localhost -p "$PORT" -U postgres -O edunomad edunomad >/dev/null 2>&1
fi

# 4) Install deps if needed, then sync schema.
[ -d node_modules ] || npm install >/dev/null 2>&1
npx prisma db push --skip-generate >/dev/null 2>&1

# 5) Seed only when the database has no admin user yet (don't clobber edits).
HAS_ADMIN=$(PGPASSWORD=edunomad "$PGBIN/psql" -h localhost -p "$PORT" -U edunomad -d edunomad -tAc \
  'SELECT count(*) FROM "AdminUser"' 2>/dev/null || echo 0)
if [ "${HAS_ADMIN:-0}" = "0" ]; then
  log "seeding database"
  npx prisma db seed >/dev/null 2>&1
fi

log "ready: postgresql://edunomad:edunomad@localhost:5432/edunomad"
