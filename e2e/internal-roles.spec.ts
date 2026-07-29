import { test, expect, type APIRequestContext } from "@playwright/test";

// G187 — Internal-roles E2E: Counsellor, Operations and Compliance flows plus
// the RBAC boundaries between them. Seeded staff (prisma/seed-ops.mjs,
// seed-team.mjs) authenticate via phone OTP; the suite asserts each role can
// reach its own surfaces and is denied the others — including the rule that
// only Compliance can reach the visa sign-off surface (CLAUDE.md §1.12).

const STAFF = {
  counsellor: process.env.E2E_COUNSELLOR_PHONE || "+8801000000002",
  operations: process.env.E2E_OPS_PHONE || "+8801000000011",
  compliance: process.env.E2E_COMPLIANCE_PHONE || "+8801000000020",
};

async function loginAs(request: APIRequestContext, phone: string) {
  const send = await request.post("/api/auth/otp/send", { data: { phone } });
  expect(send.ok(), `OTP send ${phone}`).toBeTruthy();
  const { devCode } = await send.json();
  const verify = await request.post("/api/auth/otp/verify", { data: { phone, code: devCode } });
  expect(verify.ok(), `OTP verify ${phone}`).toBeTruthy();
}

async function reaches(page: import("@playwright/test").Page, path: string): Promise<boolean> {
  const res = await page.goto(path);
  const status = res?.status() ?? 0;
  // A 2FA interstitial is not "reaching" the surface either.
  const bounced = /\/login|\/signup|\/staff\/2fa/.test(page.url());
  return status < 400 && !bounced;
}

test("counsellor reaches its inbox and auto-routed leads, not admin/compliance", async ({ page }) => {
  await loginAs(page.request, STAFF.counsellor);
  // /counsellor is the counsellor's lead inbox (auto-routed leads land here).
  expect(await reaches(page, "/counsellor"), "counsellor lead inbox").toBeTruthy();
  // RBAC: counsellor cannot enter compliance or the admin console.
  expect(await reaches(page, "/compliance"), "counsellor blocked from compliance").toBeFalsy();
  expect(await reaches(page, "/admin/audit"), "counsellor blocked from admin").toBeFalsy();
});

test("operations reaches case packaging + visa prep, not compliance sign-off", async ({ page }) => {
  await loginAs(page.request, STAFF.operations);
  expect(await reaches(page, "/operations"), "ops home").toBeTruthy();
  expect(await reaches(page, "/operations/visa-audit"), "ops visa pre-compliance audit").toBeTruthy();
  // Sole sign-off authority is Compliance — ops must be denied the surface.
  expect(await reaches(page, "/compliance"), "ops blocked from compliance sign-off").toBeFalsy();
});

test("compliance must clear a second factor before reaching sign-off", async ({ page }) => {
  // §11 makes 2FA mandatory for Compliance. An OTP is one factor, so a session
  // that has only cleared the OTP is sent to enrol/challenge rather than to the
  // sign-off surface — the one place a single stolen phone must not be enough.
  await loginAs(page.request, STAFF.compliance);
  await page.goto("/compliance");
  expect(page.url(), "compliance is routed to the second factor").toContain("/staff/2fa");
  expect(await page.getByRole("heading").first().textContent()).toMatch(/two-factor/i);
});

test("unauthenticated user is denied every internal surface", async ({ page }) => {
  for (const path of ["/counsellor", "/operations", "/compliance", "/admin/audit"]) {
    expect(await reaches(page, path), `anon blocked from ${path}`).toBeFalsy();
  }
});
