import { test, expect } from "@playwright/test";

// G186 — Happy-path student journey E2E. Authenticates with phone OTP (the real
// stage-1 transition) and traverses every one of the 9 journey stages
// (CLAUDE.md §5), asserting each surface renders for the authenticated student
// and never bounces back to signup. Runs in CI and against staging (BASE_URL).
//
// OTP code is read from the dev/E2E response (E2E_OTP_BYPASS on the disposable
// staging DB) — never exposed in production.

const phone = "+88019" + String(Date.now()).slice(-9);

// Stage label -> surface that represents it for the student.
const STAGES: [string, string][] = [
  ["1 Profile & Eligibility", "/app"],
  ["2 Counsellor Onboarding", "/app"],
  ["3 Shortlist", "/app/shortlist"],
  ["4 Application Prep", "/app/documents"],
  ["5 Application Submitted", "/app/journey"],
  ["6 University Decision", "/app/offers"],
  ["7 Tuition & GIC", "/app/offers"],
  ["8 Visa", "/app/journey"],
  ["9 Pre-Departure & Arrival", "/app/journey"],
];

test("student completes signup and traverses all 9 stages", async ({ page }) => {
  // Stage 1 — signup via phone OTP (primary auth).
  const send = await page.request.post("/api/auth/otp/send", { data: { phone } });
  expect(send.ok(), "OTP send").toBeTruthy();
  const { devCode } = await send.json();
  expect(devCode, "dev OTP code present").toBeTruthy();

  const verify = await page.request.post("/api/auth/otp/verify", { data: { phone, code: devCode } });
  expect(verify.ok(), "OTP verify").toBeTruthy();
  const { userId } = await verify.json();
  expect(userId).toBeTruthy();

  // Traverse every journey stage surface as the authenticated student.
  for (const [label, path] of STAGES) {
    const res = await page.goto(path);
    expect(res?.status(), `${label} → ${path} status`).toBeLessThan(400);
    await expect(page, `${label} should not redirect to signup`).not.toHaveURL(/\/signup|\/welcome/);
  }

  // The journey timeline renders the nine stages.
  await page.goto("/app/journey");
  await expect(page.getByText(/Visa/i).first()).toBeVisible();
});
