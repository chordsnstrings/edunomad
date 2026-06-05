import { defineConfig, devices } from "@playwright/test";

// E2E config (G186/G187/G176). Mobile-first (CLAUDE.md §1): the default project
// is a phone viewport. Runs against a local production build by default, or
// against staging when BASE_URL is set (G186 AC2 "runs against staging").
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "mobile-chromium", use: { ...devices["Pixel 7"] } }],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run start -- --port 3000",
        url: "http://localhost:3000/api/health",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: { E2E_OTP_BYPASS: "1" },
      },
});
