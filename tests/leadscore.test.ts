import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { computeLeadScore, leadScoreBreakdown } from "../src/lib/leadscore";

describe("G048 — lead score", () => {
  it("scores a strong profile above 80", () => {
    const score = computeLeadScore({
      completenessPct: 100,
      englishProficiency: { type: "in_hand" },
      budgetMaxUsd: 25000,
      destinations: ["CA", "UK"],
      intakeTarget: { choice: "specific" },
      sourceAttribution: { referral_code: "ABC" },
    });
    assert.ok(score > 80, `expected > 80, got ${score}`);
  });

  it("scores a weak profile below 40", () => {
    const score = computeLeadScore({
      completenessPct: 30,
      englishProficiency: { type: "none" },
      budgetMaxUsd: null,
      destinations: [],
      intakeTarget: { choice: "undecided" },
      sourceAttribution: null,
    });
    assert.ok(score < 40, `expected < 40, got ${score}`);
  });

  it("breakdown sums to the score (capped 100)", () => {
    const s = { completenessPct: 100, englishProficiency: { type: "in_hand" }, budgetMaxUsd: 25000, destinations: ["CA"], intakeTarget: { choice: "specific" }, sourceAttribution: { referral_code: "x" } };
    const sum = leadScoreBreakdown(s).reduce((a, f) => a + f.points, 0);
    assert.equal(computeLeadScore(s), Math.min(100, sum));
  });
});
