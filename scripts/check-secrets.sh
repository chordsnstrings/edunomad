#!/usr/bin/env bash
# Committed-secret scanner (G184 AC3). Fails (exit 1) if any tracked file looks
# like it contains a real credential. Runs in CI (secret-scan job). For deeper
# coverage, gitleaks can be layered on; this is a zero-dependency baseline.
set -uo pipefail

# High-confidence credential patterns (provider keys, private keys).
STRONG='AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9A-Za-z-]{10,}|sk_live_[0-9A-Za-z]{16,}|sk-ant-[0-9A-Za-z_-]{20,}|ghp_[0-9A-Za-z]{36}|AIza[0-9A-Za-z_-]{35}'

# Postgres URLs WITH inline credentials...
PG='postgres(ql)?://[^:@/ ]+:[^@/ ]+@[^/ ]+'
# ...but throwaway local / CI-service-container DSNs are not secrets.
SAFE_PG='@(localhost|127\.0\.0\.1|postgres|db|host\.docker\.internal)([:/]|$)'

# Self, docs, markdown, lockfile and the env template are not scanned.
EXCLUDE_RE='^(docs/|\.env\.example$|package-lock\.json$|scripts/check-secrets\.sh$|.*\.md$)'

fail=0
while IFS= read -r f; do
  [[ "$f" =~ $EXCLUDE_RE ]] && continue
  [ -f "$f" ] || continue

  strong=$(grep -nEI "$STRONG" "$f" 2>/dev/null || true)
  pg=$(grep -nEI "$PG" "$f" 2>/dev/null | grep -vE "$SAFE_PG" || true)

  if [ -n "$strong" ] || [ -n "$pg" ]; then
    echo "::error file=$f::possible committed secret"
    { [ -n "$strong" ] && echo "$strong"; [ -n "$pg" ] && echo "$pg"; } | sed 's/^/  /' | cut -c1-120
    fail=1
  fi
done < <(git ls-files)

if [ "$fail" -ne 0 ]; then
  echo "Secret scan FAILED — remove secrets and use the secret manager (docs/cc/secrets.md)."
  exit 1
fi
echo "Secret scan passed — no committed credentials found."
