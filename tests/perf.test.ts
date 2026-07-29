import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PERF_BUDGETS, measure, withinBudget } from "../src/lib/perf";
import { getActivityFeed } from "../src/lib/feed";
import { matchSnippets } from "../src/lib/sop-snippets";
import { dispatchPushForEvent } from "../src/lib/push";
import { readFileSync } from "node:fs";

// Synthetic performance budgets (G175 / CLAUDE.md §10). These assert the
// SERVER-side budgets in-process. Browser budgets (signup TTI, profile save
// paint) are asserted by Lighthouse CI against lighthouse-budgets.json.

describe("performance budgets", () => {
  it("withinBudget compares against the §10 limits", () => {
    assert.equal(withinBudget("feedUpdateMs", 999), true);
    assert.equal(withinBudget("feedUpdateMs", 1001), false);
    assert.equal(PERF_BUDGETS.signupTtiMs, 3000);
    assert.equal(PERF_BUDGETS.pushDispatchMs, 5000);
  });

  it("activity feed update is within 1s budget", async () => {
    const m = await measure("feedUpdateMs", () =>
      getActivityFeed({ roleShort: "S", locale: "en", limit: 20 }),
    );
    assert.ok(m.ok, `feed query took ${Math.round(m.ms)}ms (budget ${m.budgetMs}ms)`);
  });

  it("SOP contextual snippet match is within 500ms budget", async () => {
    const m = await measure("sopSnippetMs", () =>
      matchSnippets({
        englishProficiency: { type: "none" },
        academic: { scoreType: "gpa", score: 3.2 },
        budgetMaxUsd: 25000,
        destinations: ["CA"],
      }),
    );
    assert.ok(m.ok, `snippet match took ${Math.round(m.ms)}ms (budget ${m.budgetMs}ms)`);
    assert.ok(m.value.length > 0);
  });

  it("push dispatch completes within 5s budget", async () => {
    const m = await measure("pushDispatchMs", () =>
      dispatchPushForEvent({ type: "profile.completed", channels: { push: true }, payload: {} }, []),
    );
    assert.ok(m.ok, `dispatch took ${Math.round(m.ms)}ms (budget ${m.budgetMs}ms)`);
  });
});

describe("M6 — translation catalogues stay out of the shared client bundle", () => {
  it("the client provider does not import the catalogue barrel", () => {
    const src = readFileSync("src/i18n/LocaleProvider.tsx", "utf8");
    assert.ok(src.startsWith('"use client"'), "provider is a client component");
    // `@/i18n` re-exports MESSAGES, which is every locale. Importing it here put
    // all four catalogues into a chunk that every page referenced.
    assert.ok(
      !/from "@\/i18n"/.test(src),
      "LocaleProvider must not import @/i18n — it drags all four catalogues client-side",
    );
    assert.ok(!/from "\.\/messages"/.test(src));
  });

  it("every surface that mounts a provider hands it exactly one catalogue", () => {
    const mounts = [
      "src/app/app/layout.tsx",
      "src/app/onboarding/layout.tsx",
      "src/app/signup/page.tsx",
      "src/app/eligibility/page.tsx",
      "src/app/parent/(app)/layout.tsx",
    ];
    for (const f of mounts) {
      const src = readFileSync(f, "utf8");
      assert.match(
        src,
        /<LocaleProvider locale=\{locale\} messages=\{clientMessages\(locale\)\}>/,
        `${f} must pass the active locale's catalogue`,
      );
    }
  });

  it("the root fallback provider ships no catalogue at all", () => {
    // Public marketing pages sit under it and have the 4G TTI budget; nothing
    // directly beneath it calls useT.
    const src = readFileSync("src/app/layout.tsx", "utf8");
    assert.match(src, /<LocaleProvider locale="en">/);
    assert.ok(!src.includes("clientMessages"));
  });
});
