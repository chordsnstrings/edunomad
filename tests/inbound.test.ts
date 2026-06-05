import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { extractReferenceId } from "../src/lib/inbound";

describe("G063 — inbound email reference matching", () => {
  it("extracts the reference id from a subject", () => {
    assert.equal(extractReferenceId("Re: Application — MSc CS — EN-AB12CD34"), "EN-AB12CD34");
  });
  it("returns null when absent", () => {
    assert.equal(extractReferenceId("Hello, no reference here"), null);
  });
});
