import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkPlagiarism, wordCount, PLAGIARISM_THRESHOLD } from "../src/lib/sop-polish";

describe("G056 — SOP plagiarism gate", () => {
  it("scores original varied text low (passes the gate)", () => {
    const text = "I want to study data science in Canada. My background in mathematics drives this. I plan to return and build local capacity.";
    const score = checkPlagiarism(text);
    assert.ok(score <= PLAGIARISM_THRESHOLD, `expected <= ${PLAGIARISM_THRESHOLD}, got ${score}`);
  });

  it("scores heavily repeated text high (blocks the gate)", () => {
    const sentence = "This is a generic statement about my ambitions and goals abroad. ";
    const score = checkPlagiarism(sentence.repeat(6));
    assert.ok(score > PLAGIARISM_THRESHOLD, `expected > ${PLAGIARISM_THRESHOLD}, got ${score}`);
  });

  it("counts words", () => {
    assert.equal(wordCount("hello there world"), 3);
    assert.equal(wordCount(""), 0);
  });
});
