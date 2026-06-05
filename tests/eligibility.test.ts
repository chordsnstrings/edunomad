import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db";
import { runEligibility, classify, meetsEnglish, academicPercent } from "../src/lib/eligibility";

describe("G027 — eligibility match engine", () => {
  after(async () => {
    await prisma.$disconnect();
  });

  it("normalizes academic score to percent", () => {
    assert.equal(academicPercent({ scoreType: "gpa", score: 4 }), 40);
    assert.equal(academicPercent({ scoreType: "percentage", score: 72 }), 72);
    assert.equal(academicPercent(null), null);
  });

  it("classifies into reach/match/safe with English downgrade", () => {
    assert.equal(classify(80, 65, true), "safe");
    assert.equal(classify(66, 65, true), "match");
    assert.equal(classify(60, 65, true), "reach");
    assert.equal(classify(40, 65, true), null);
    assert.equal(classify(80, 65, false), "match");
  });

  it("applies English alternatives", () => {
    const inst = { acceptsMoiLetter: true, englishMinIelts: 6, englishMinDuolingo: 110, englishMinPte: 58 };
    const prog = { englishMinSpecificIelts: null, englishMinSpecificDuolingo: null };
    assert.equal(meetsEnglish(inst, prog, { type: "moi" }), true);
    assert.equal(meetsEnglish({ ...inst, acceptsMoiLetter: false }, prog, { type: "moi" }), false);
    assert.equal(meetsEnglish(inst, prog, { type: "in_hand", testType: "IELTS", score: 5 }), false);
    assert.equal(meetsEnglish(inst, prog, { type: "in_hand", testType: "IELTS", score: 6.5 }), true);
    assert.equal(meetsEnglish(inst, prog, { type: "planning" }), true);
  });

  it("returns three buckets from the catalog within the time budget", async () => {
    const start = Date.now();
    const res = await runEligibility({
      academic: { scoreType: "percentage", score: 70 },
      budgetMaxUsd: 40000,
      destinations: ["CA", "UK", "AU", "MY"],
      fieldCategory: "computing",
    });
    assert.ok(Date.now() - start < 5000);
    assert.ok(res.total > 0);
    assert.ok(res.countries.length > 0);
    assert.equal(res.total, res.reach.length + res.match.length + res.safe.length);
  });
});
