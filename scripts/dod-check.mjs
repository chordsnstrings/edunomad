#!/usr/bin/env node
// Definition-of-Done verification (G188). Mirrors CLAUDE.md §17 and gates final
// sign-off. Run: `node scripts/dod-check.mjs`. Exits non-zero if any structural
// check fails (used as the final acceptance gate).
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const index = JSON.parse(readFileSync(join(root, "goals/_index.json"), "utf8"));
const goals = index.goals ?? [];

const done = goals.filter((g) => g.status === "done");
const notDone = goals.filter((g) => g.status !== "done");

const checks = [];
const check = (label, pass, detail = "") => checks.push({ label, pass, detail });

// §17 — Definition of done for v1.
check(`All goals done (${done.length}/${goals.length})`, notDone.length === 0,
  notDone.length ? `pending: ${notDone.map((g) => g.id).join(", ")}` : "");

// Journey surfaces exist (signup → shortlist → submission → offer → deposit →
// visa file → visa decision → arrival), all role apps present.
const surfaces = [
  ["Student journey", "src/app/app"],
  ["Signup", "src/components/auth/SignupFlow.tsx"],
  ["Counsellor app", "src/app/counsellor"],
  ["Operations app", "src/app/operations"],
  ["Compliance app", "src/app/compliance"],
  ["Parent app", "src/app/parent"],
  ["Admin dashboard", "src/app/admin"],
];
for (const [label, p] of surfaces) check(`Surface present: ${label}`, existsSync(join(root, p)));

// i18n in 4 languages.
const locales = ["en", "bn", "hi", "ne"].every((l) => existsSync(join(root, `src/i18n/messages/${l}.ts`)));
check("i18n EN/BN/HI/NE present", locales);

// Append-only hash-chained audit + events.
check("Hash chain lib present", existsSync(join(root, "src/lib/hashchain.ts")));
check("Append-only hardening present", existsSync(join(root, "prisma/harden.mjs")));

// Compliance sole sign-off authority.
check("Compliance sign-off lib present", existsSync(join(root, "src/lib/compliance.ts")) || existsSync(join(root, "src/lib/visa.ts")));

// Cross-cutting platform.
check("Lighthouse CI config", existsSync(join(root, "lighthouserc.json")));
check("Performance budgets", existsSync(join(root, "lighthouse-budgets.json")) && existsSync(join(root, "src/lib/perf.ts")));
check("Health endpoint", existsSync(join(root, "src/app/api/health/route.ts")));
check("Structured logger", existsSync(join(root, "src/lib/log.ts")));
check("Rate limiting", existsSync(join(root, "src/lib/ratelimit.ts")));
check("Error monitoring", existsSync(join(root, "src/lib/monitoring.ts")));
check("Analytics", existsSync(join(root, "src/lib/analytics.ts")));
check("CI/CD pipeline", existsSync(join(root, ".github/workflows/ci.yml")) && existsSync(join(root, ".github/workflows/deploy.yml")));
check("Backup + restore", existsSync(join(root, "scripts/backup.sh")) && existsSync(join(root, "scripts/restore-test.sh")));
check("E2E suites", existsSync(join(root, "e2e/student-journey.spec.ts")) && existsSync(join(root, "e2e/internal-roles.spec.ts")));

// Render report.
let failed = 0;
console.log("\n  EduNomad — Definition of Done (CLAUDE.md §17)\n");
for (const c of checks) {
  const mark = c.pass ? "PASS" : "FAIL";
  if (!c.pass) failed++;
  console.log(`  [${mark}] ${c.label}${c.detail ? `  — ${c.detail}` : ""}`);
}

// Workflow rollup.
const byWf = {};
for (const g of goals) {
  byWf[g.workflow] ??= { total: 0, done: 0 };
  byWf[g.workflow].total++;
  if (g.status === "done") byWf[g.workflow].done++;
}
console.log("\n  Workflow rollup:");
for (const wf of Object.keys(byWf).sort()) {
  console.log(`    ${wf.padEnd(4)} ${byWf[wf].done}/${byWf[wf].total}`);
}
console.log(`\n  ${done.length}/${goals.length} goals done · ${failed} DoD check(s) failed\n`);

if (failed > 0) process.exit(1);
console.log("  ✓ Definition of Done satisfied.\n");
