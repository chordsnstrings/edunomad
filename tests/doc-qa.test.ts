import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { levenshtein, runDocQa } from "../src/lib/doc-qa";

describe("G042 — document first-pass QA", () => {
  it("computes Levenshtein distance", () => {
    assert.equal(levenshtein("rahman", "rahman"), 0);
    assert.equal(levenshtein("rahman", "rahmaan"), 1);
    assert.equal(levenshtein("abc", "xyz"), 3);
  });

  it("passes a legible file but still queues human QA", () => {
    const { results, flagged } = runDocQa({ fullName: "Asha Rahman" }, 200 * 1024);
    assert.equal(results.readable.pass, true);
    assert.equal(results.human_qa_required, true);
    assert.equal(flagged, false);
  });

  it("flags an illegible (tiny) file", () => {
    const { results, flagged } = runDocQa({ fullName: "Asha Rahman" }, 1024);
    assert.equal(results.readable.pass, false);
    assert.equal(flagged, true);
  });
});
