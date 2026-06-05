import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { scoreCounsellor, routeStudent, type Candidate } from "../src/lib/routing";

const now = Date.now();
const base = (over: Partial<Candidate>): Candidate => ({
  userId: "c", languages: ["en"], destinations: ["CA"], capacity: 25, currentLoad: 0,
  tenureStartedAt: new Date(now - 365 * 24 * 3600 * 1000), ...over,
});

describe("G029 — counsellor routing engine", () => {
  it("scores language + destination matches higher", () => {
    const student = { language: "bn", destinations: ["CA"], leadScore: 50 };
    const good = base({ userId: "good", languages: ["en", "bn"], destinations: ["CA"] });
    const bad = base({ userId: "bad", languages: ["en"], destinations: ["MY"] });
    assert.ok(scoreCounsellor(student, good, now) > scoreCounsellor(student, bad, now));
  });

  it("excludes counsellors over 130% capacity", () => {
    const student = { language: "en", destinations: ["CA"], leadScore: 50 };
    const overloaded = base({ userId: "over", capacity: 10, currentLoad: 14 });
    assert.equal(routeStudent(student, [overloaded], now), null);
  });

  it("returns the best candidate and breaks ties by tenure", () => {
    const student = { language: "en", destinations: ["CA"], leadScore: 50 };
    const senior = base({ userId: "senior", tenureStartedAt: new Date(now - 4 * 365 * 24 * 3600 * 1000) });
    const junior = base({ userId: "junior", tenureStartedAt: new Date(now - 100 * 24 * 3600 * 1000) });
    // identical language/dest/load → leadFit favours tenure, and tie-break too
    const best = routeStudent(student, [junior, senior], now);
    assert.equal(best?.userId, "senior");
  });

  it("returns null when there are no candidates", () => {
    assert.equal(routeStudent({ language: "en", destinations: ["CA"] }, [], now), null);
  });
});
