#!/usr/bin/env bash
# Deploy hook (G180). Thin wrapper around the chosen host's deploy command so
# the CI workflow stays host-agnostic. Set DEPLOY_CMD in the environment to the
# provider command (e.g. `vercel deploy --prebuilt --prod`, a `flyctl deploy`,
# or a container push). Without it, this is a no-op that records the intent.
set -euo pipefail
ENVIRONMENT="${1:?usage: deploy.sh <staging|production>}"

echo "[deploy] target environment: $ENVIRONMENT"
if [ -n "${DEPLOY_CMD:-}" ]; then
  echo "[deploy] running provider command"
  eval "$DEPLOY_CMD"
else
  echo "[deploy] DEPLOY_CMD not set — skipping (configure per host, see docs/cc/deployment.md)"
fi
