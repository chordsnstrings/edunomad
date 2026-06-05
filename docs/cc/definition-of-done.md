# Definition of Done — v1 verification checklist (G188)

Mirrors CLAUDE.md §17. Run `node scripts/dod-check.mjs` for the automated
structural gate; the items below add the manual/CI sign-offs. The build is done
when every box is checked.

## §17 — the build is done when…

- [ ] **All 188 goals pass `/verify`** — `goals/_index.json` shows every goal
      `done` (automated: `scripts/dod-check.mjs`).
- [ ] **Full student journey works end-to-end** — signup → shortlist →
      submission → offer → deposit → visa file → visa decision → arrival,
      visible to student **and** parent, in **4 languages** (EN/BN/HI/NE).
      Covered by `e2e/student-journey.spec.ts` (9 stages) + i18n catalogs.
- [ ] **A counsellor can manage 20+ students** through the platform alone —
      counsellor inbox, lead routing, shortlist, parent mgmt
      (`e2e/internal-roles.spec.ts`).
- [ ] **Compliance can sign off a visa file** with full audit trail,
      registration number, and hash chain — sole sign-off authority enforced
      (CLAUDE.md §1.12); evidence packet at `/api/visa/[id]/evidence`.
- [ ] **Finance can reconcile** payments, commissions, payouts, refunds —
      multi-currency.
- [ ] **Lighthouse PWA audit ≥ 90** — `lighthouserc.json` asserted in the
      `lighthouse` CI job (G174).
- [ ] **All RBAC denials log an audit entry** — deny-by-default, server-side
      (`src/lib/rbac.ts`, audit chain).
- [ ] **All non-test goals have a commit** referencing the goal id; one commit
      per goal.

## Cross-cutting gates

- [ ] CI green: lint · type-check · test · build (`ci.yml` → `build-test`).
- [ ] E2E green: student journey + internal roles + axe a11y (`ci.yml` → `e2e`).
- [ ] Performance budgets met — Lighthouse budgets + `tests/perf.test.ts` (§10).
- [ ] Backups running; weekly restore test green (G179).
- [ ] HTTPS only + HSTS (G183); secrets in the manager, none in the repo (G184).
- [ ] Health endpoint live; uptime monitor + on-call paging configured (G181).
- [ ] Error monitoring receiving events; structured logs, no PII at INFO
      (G177/G185).

## How to run the gate

```bash
node scripts/dod-check.mjs     # structural: goals done + surfaces + platform
npm run lint && npx tsc --noEmit -p tsconfig.json
npm test                       # unit/integration
npm run build                  # production build
npm run test:e2e               # Playwright (journey + roles + a11y)
npm run lighthouse             # PWA ≥ 90 + budgets
```
