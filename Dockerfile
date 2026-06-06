# syntax=docker/dockerfile:1
# Production image for EduNomad — Next.js 16 (standalone) + Prisma 6.
# Built by DigitalOcean App Platform (Dockerfile deploy) and portable to a
# Droplet / any container registry. See docs/cc/digitalocean.md.

FROM node:22-slim AS base
# OpenSSL + CA certs are required by the Prisma query engine on Debian.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ── Dependencies (incl. dev — needed to build) ─────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ── Build: Prisma client + Next standalone bundle ──────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN NODE_ENV=production npm run build

# ── Runtime (minimal, non-root) ────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs --create-home --home-dir /home/nextjs nextjs
ENV HOME=/home/nextjs

# Next.js standalone server + static assets + PWA files.
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Prisma client + engine + schema + harden/seed scripts (for the release job).
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000

# Container-level liveness (App Platform also probes /api/health over HTTP).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Web service runs the standalone server; the PRE_DEPLOY job overrides this
# command with `bash scripts/do-release.sh` (migrations + seed).
CMD ["node", "server.js"]
