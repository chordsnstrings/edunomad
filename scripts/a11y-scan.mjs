#!/usr/bin/env node
/**
 * Blocking WCAG 2.1 A/AA scan over rendered pages.
 *
 * The axe coverage that existed ran under Playwright in a job marked
 * `continue-on-error`, over four public routes. A gate that cannot fail is not a
 * gate, and four routes is not the app: the authenticated surfaces — where the
 * icon-only buttons, dialogs and dense staff tables live — were never checked at
 * all.
 *
 * This runs axe-core inside jsdom against the real server output, so it needs no
 * browser download and can therefore block in CI. It signs in through the E2E
 * OTP bypass to reach the authenticated routes, and exits non-zero on any
 * serious or critical violation.
 *
 * Usage: node scripts/a11y-scan.mjs [--base http://localhost:3000]
 */
import { JSDOM, VirtualConsole } from "jsdom";
import axe from "axe-core";

const argBase = process.argv.indexOf("--base");
const BASE = (argBase > -1 ? process.argv[argBase + 1] : process.env.BASE_URL) || "http://localhost:3000";

const PUBLIC = [
  "/",
  "/signup",
  "/welcome",
  "/guides",
  "/bn/guides",
  "/hi/guides",
  "/ne/guides",
  "/guides/study-in-canada-from-bangladesh",
  "/guides/canada-student-visa-from-bangladesh",
  "/guides/cost-of-living-in-toronto-for-students",
  "/bn/guides/study-in-canada-from-bangladesh",
  "/privacy",
  "/terms",
  "/editorial-standards",
  "/offline",
  "/counsellor/login",
  "/operations/login",
  "/compliance/login",
  "/finance/login",
  "/education/login",
  "/parent/login",
  "/admin/login",
];

/** Authenticated surfaces, scanned as the seeded user for each role. */
const AUTHED = [
  { phone: process.env.E2E_STUDENT_PHONE || "+8801712345001", paths: [
    "/app", "/app/journey", "/app/documents", "/app/shortlist", "/app/messages",
    "/app/offers", "/app/parent", "/app/predeparture", "/app/activity",
  ] },
  { phone: process.env.E2E_COUNSELLOR_PHONE || "+8801000000002", paths: [
    "/counsellor", "/counsellor/my-stats",
  ] },
  { phone: process.env.E2E_CM_PHONE || "+8801000000000", paths: [
    "/counsellor", "/counsellor/escalations", "/counsellor/qa", "/counsellor/team",
    "/counsellor/refunds", "/counsellor/tiers", "/counsellor/standup", "/counsellor/hiring",
  ] },
  { phone: process.env.E2E_OPS_PHONE || "+8801000000011", paths: [
    "/operations", "/operations/replies",
  ] },
  { phone: process.env.E2E_OM_PHONE || "+8801000000010", paths: [
    "/operations", "/operations/approvals", "/operations/visa-audit",
  ] },
  { phone: process.env.E2E_FINANCE_PHONE || "+8801000000030", paths: [
    "/finance", "/finance/commissions", "/finance/payouts", "/finance/refunds",
  ] },
  { phone: process.env.E2E_EM_PHONE || "+8801000000040", paths: [
    "/education", "/education/escalations",
  ] },
];

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function scan(path, cookie) {
  const res = await fetch(BASE + path, {
    redirect: "follow",
    headers: cookie ? { cookie } : {},
  });
  const html = await res.text();
  // A redirect to a login page means the fixture is not signed in; scanning the
  // login page again would report a false pass for the route we asked for.
  const landed = new URL(res.url).pathname;
  const vc = new VirtualConsole();
  const dom = new JSDOM(html, {
    url: BASE + path,
    virtualConsole: vc,
    pretendToBeVisual: true,
    runScripts: "outside-only",
  });
  const { window } = dom;
  window.eval(axe.source);
  const results = await window.axe.run(window.document, {
    runOnly: { type: "tag", values: TAGS },
    resultTypes: ["violations"],
  });
  // Next emits a meta-refresh interstitial for a server redirect it could not
  // follow. That page is not the route we asked for, so scanning it would report
  // a violation for markup we do not own — and, worse, a clean pass for a route
  // the fixture cannot actually reach.
  const redirected = window.document.getElementById("__next-page-redirect") !== null;
  dom.window.close();
  return { status: res.status, landed, redirected, violations: results.violations };
}

async function signIn(phone) {
  const send = await fetch(`${BASE}/api/auth/otp/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const { devCode } = await send.json().catch(() => ({}));
  if (!devCode) return null; // E2E_OTP_BYPASS not set — skip the authed sweep
  const verify = await fetch(`${BASE}/api/auth/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code: devCode }),
  });
  if (!verify.ok) return null;
  const setCookie = verify.headers.getSetCookie?.() ?? [];
  const session = setCookie.find((c) => c.startsWith("en_session="));
  return session ? session.split(";")[0] : null;
}

let failures = 0;
let scanned = 0;
let skipped = 0;

function report(path, r) {
  const serious = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  const minor = r.violations.length - serious.length;
  const mark = serious.length ? "FAIL" : "ok  ";
  console.log(
    `${mark} ${String(r.status).padEnd(3)} ${path.padEnd(48)}` +
      (serious.length ? ` ${serious.length} serious/critical` : minor ? ` (${minor} minor)` : ""),
  );
  for (const v of serious) {
    failures++;
    console.log(`       ${v.impact} · ${v.id} · ${v.nodes.length} node(s) — ${v.help}`);
    for (const n of v.nodes.slice(0, 3)) console.log(`         ${n.html.slice(0, 140)}`);
  }
}

console.log(`axe (WCAG 2.1 A/AA) against ${BASE}\n`);

for (const path of PUBLIC) {
  const r = await scan(path);
  if (r.status >= 500) {
    failures++;
    console.log(`FAIL ${r.status} ${path} — server error`);
    continue;
  }
  scanned++;
  report(path, r);
}

for (const { phone, paths } of AUTHED) {
  const cookie = await signIn(phone);
  if (!cookie) {
    skipped += paths.length;
    console.log(`\n-- skipped ${paths.length} route(s) for ${phone}: no session (E2E_OTP_BYPASS unset or fixture missing)`);
    continue;
  }
  console.log(`\n-- as ${phone}`);
  for (const path of paths) {
    const r = await scan(path, cookie);
    if (r.redirected || (r.landed !== path && /\/login|\/signup|\/welcome|\/staff\/2fa/.test(r.landed))) {
      skipped++;
      console.log(`skip ${r.status} ${path.padEnd(48)} → redirected (role cannot reach it)`);
      continue;
    }
    scanned++;
    report(path, r);
  }
}

console.log(
  `\n${scanned} route(s) scanned, ${skipped} skipped, ${failures} serious/critical violation(s)`,
);
if (skipped > 0 && scanned === PUBLIC.length) {
  console.log("note: no authenticated route was scanned — set E2E_OTP_BYPASS=1 and seed the fixtures");
}
process.exit(failures > 0 ? 1 : 0);
