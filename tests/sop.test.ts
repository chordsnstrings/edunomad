import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkPlagiarism, wordCount, PLAGIARISM_THRESHOLD } from "../src/lib/sop-polish";
import { evaluateCondition } from "../src/lib/sop-conditions";

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

describe("M48 — SOP trigger conditions are actually evaluated (§8)", () => {
  const ctx = {
    student: { english_proficiency: "none", profile_completeness: 40, funding_source: "loan" },
  };

  it("treats an absent condition as always-on", () => {
    assert.equal(evaluateCondition("", ctx), true);
    assert.equal(evaluateCondition(undefined, ctx), true);
  });

  it("evaluates the documented equality form", () => {
    assert.equal(evaluateCondition("student.english_proficiency == 'none'", ctx), true);
    assert.equal(evaluateCondition("student.english_proficiency == 'ielts'", ctx), false);
    assert.equal(evaluateCondition("student.english_proficiency != 'none'", ctx), false);
  });

  it("evaluates the documented OR form from CLAUDE.md §8", () => {
    assert.equal(
      evaluateCondition(
        "student.english_proficiency == 'none' OR student.english_proficiency == 'planning'",
        ctx,
      ),
      true,
    );
    assert.equal(
      evaluateCondition(
        "student.english_proficiency == 'ielts' OR student.english_proficiency == 'planning'",
        ctx,
      ),
      false,
    );
  });

  it("compares numerically without treating >= as >", () => {
    assert.equal(evaluateCondition("student.profile_completeness < 95", ctx), true);
    assert.equal(evaluateCondition("student.profile_completeness >= 40", ctx), true);
    assert.equal(evaluateCondition("student.profile_completeness > 40", ctx), false);
  });

  it("binds AND tighter than OR", () => {
    assert.equal(
      evaluateCondition(
        "student.profile_completeness > 90 AND student.funding_source == 'loan' OR student.english_proficiency == 'none'",
        ctx,
      ),
      true,
    );
  });

  it("reports unknown rather than guessing, so guidance hides and gates stay closed", () => {
    assert.equal(evaluateCondition("student.english_proficiency ~~ 'none'", ctx), null);
    assert.equal(evaluateCondition("totally unparseable", ctx), null);
    // A satisfied branch still wins even if a sibling branch is unparseable.
    assert.equal(evaluateCondition("nonsense OR student.english_proficiency == 'none'", ctx), true);
  });

  it("treats an absent field as unsatisfied, not as a match", () => {
    assert.equal(evaluateCondition("student.missing_field == 'x'", ctx), false);
    assert.equal(evaluateCondition("student.missing_field == null", ctx), false);
  });

  it("does not let a condition reach outside the supplied context", () => {
    assert.equal(evaluateCondition("constructor == 'x'", ctx), false);
    assert.equal(evaluateCondition("student.constructor.name == 'Object'", ctx), false);
  });
});
