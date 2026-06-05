import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// G176 — Automated WCAG 2.1 AA checks with axe-core on the primary public
// flows. CI fails on any serious/critical violation. Authenticated flows
// (profile builder, shortlist lock, payment) are covered by the manual
// screen-reader walkthrough recorded in docs/cc/accessibility.md.

const PUBLIC_FLOWS = ["/", "/signup", "/welcome", "/eligibility"];

for (const path of PUBLIC_FLOWS) {
  test(`a11y: ${path} has no WCAG A/AA violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious, JSON.stringify(serious.map((v) => ({ id: v.id, nodes: v.nodes.length })), null, 2)).toEqual([]);
  });

  test(`keyboard: ${path} is reachable by Tab`, async ({ page }) => {
    await page.goto(path);
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.tagName ?? "");
    expect(focused).not.toEqual("BODY"); // focus moved to an interactive element
  });
}
