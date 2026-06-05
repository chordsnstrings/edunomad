import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { crossDocConsistency } from "../src/lib/consistency";
import { detectMisrepFlags } from "../src/lib/misrep";

describe("G081/G082 — consistency + misrepresentation", () => {
  const student = { fullName: "Asha Rahman", dateOfBirth: new Date("2003-01-01") };

  it("passes when documents are consistent", () => {
    const docs = [{ documentType: "passport", qaResults: { name_match: { pass: true }, readable: { pass: true } } }];
    const c = crossDocConsistency(student, docs);
    assert.equal(c.consistent, true);
    assert.equal(detectMisrepFlags(c).length, 0);
  });

  it("flags a name mismatch as high severity", () => {
    const docs = [{ documentType: "passport", qaResults: { name_match: { pass: false }, readable: { pass: true } } }];
    const c = crossDocConsistency(student, docs);
    assert.equal(c.consistent, false);
    const flags = detectMisrepFlags(c);
    assert.ok(flags.some((f) => f.id === "name" && f.severity === "high"));
  });

  it("flags missing DOB", () => {
    const c = crossDocConsistency({ fullName: "X", dateOfBirth: null }, []);
    assert.ok(detectMisrepFlags(c).some((f) => f.id === "date_of_birth"));
  });
});
