import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { crossDocConsistency } from "../src/lib/consistency";
import { detectMisrepFlags } from "../src/lib/misrep";
import { ARTICLES } from "../src/content/seo/articles";
import { articleDepth, articleWordCount, INDEX_FLOOR_WORDS, shouldIndex, sitemapPriority } from "../src/content/seo/quality";

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

describe("M57 — the guide corpus is not advertised as more than it is", () => {
  it("submits nothing below the substance floor", () => {
    const stubs = ARTICLES.filter((a) => !shouldIndex(a));
    for (const a of stubs) {
      assert.ok(
        articleWordCount(a) < INDEX_FLOOR_WORDS,
        `${a.slug} is excluded but is not a stub`,
      );
    }
    // The floor has to actually bite on today's corpus, or it is decoration.
    assert.ok(stubs.length > 0, "nothing is being held back — check the floor still applies");
    assert.ok(
      stubs.length < ARTICLES.length / 4,
      "more than a quarter of the corpus is stubs; that is a content problem, not a sitemap one",
    );
  });

  it("derives priority from depth, so a stub can never outrank a pillar", () => {
    const indexed = ARTICLES.filter(shouldIndex);
    const byDepth = new Map(indexed.map((a) => [a.slug, articleDepth(a)]));
    const deep = indexed.filter((a) => byDepth.get(a.slug) === "deep");
    const standard = indexed.filter((a) => byDepth.get(a.slug) === "standard");
    assert.ok(deep.length > 0 && standard.length > 0);
    const worstDeep = Math.min(...deep.map(sitemapPriority));
    const bestStandard = Math.max(...standard.map(sitemapPriority));
    assert.ok(
      worstDeep >= bestStandard,
      `a standard page (${bestStandard}) outranks a deep one (${worstDeep})`,
    );
  });

  it("keeps every priority inside the range a sitemap allows", () => {
    for (const a of ARTICLES.filter(shouldIndex)) {
      const p = sitemapPriority(a);
      assert.ok(p > 0 && p <= 1, `${a.slug} priority ${p} out of range`);
    }
  });
});
