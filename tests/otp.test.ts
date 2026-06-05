import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db";
import { sendOtp, verifyOtp } from "../src/lib/otp";

const P_OK = "+8801900000001";
const P_LOCK = "+8801900000002";
const P_EXP = "+8801900000003";
const P_RATE = "+8801900000004";
const phones = [P_OK, P_LOCK, P_EXP, P_RATE];

function wrongOf(code: string) {
  return String((Number(code) + 1) % 1_000_000).padStart(6, "0");
}

describe("G008 — phone OTP send + verify", () => {
  before(async () => {
    await prisma.otpChallenge.deleteMany({ where: { phone: { in: phones } } });
    const users = await prisma.user.findMany({ where: { phone: { in: phones } }, select: { id: true } });
    await prisma.session.deleteMany({ where: { userId: { in: users.map((u) => u.id) } } });
    await prisma.user.deleteMany({ where: { phone: { in: phones } } });
  });

  after(async () => {
    const users = await prisma.user.findMany({ where: { phone: { in: phones } }, select: { id: true } });
    await prisma.session.deleteMany({ where: { userId: { in: users.map((u) => u.id) } } });
    await prisma.user.deleteMany({ where: { phone: { in: phones } } });
    await prisma.otpChallenge.deleteMany({ where: { phone: { in: phones } } });
    await prisma.$disconnect();
  });

  it("sends then verifies, opening a session and provisioning the user", async () => {
    const sent = await sendOtp(P_OK);
    assert.equal(sent.ok, true);
    assert.ok(sent.code);
    const res = await verifyOtp(P_OK, sent.code!);
    assert.equal(res.ok, true);
    assert.ok(res.token && res.userId);
    const session = await prisma.session.findFirst({ where: { userId: res.userId! } });
    assert.notEqual(session, null);
  });

  it("locks out after 3 wrong attempts", async () => {
    const sent = await sendOtp(P_LOCK);
    const wrong = wrongOf(sent.code!);
    assert.equal((await verifyOtp(P_LOCK, wrong)).error, "invalid");
    assert.equal((await verifyOtp(P_LOCK, wrong)).error, "invalid");
    assert.equal((await verifyOtp(P_LOCK, wrong)).error, "locked");
    // even the correct code is rejected while locked
    assert.equal((await verifyOtp(P_LOCK, sent.code!)).error, "locked");
  });

  it("expires after 5 minutes", async () => {
    const sent = await sendOtp(P_EXP);
    await prisma.otpChallenge.update({
      where: { phone: P_EXP },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    assert.equal((await verifyOtp(P_EXP, sent.code!)).error, "expired");
  });

  it("rate-limits to 3 sends per hour", async () => {
    assert.equal((await sendOtp(P_RATE)).ok, true);
    assert.equal((await sendOtp(P_RATE)).ok, true);
    assert.equal((await sendOtp(P_RATE)).ok, true);
    const fourth = await sendOtp(P_RATE);
    assert.equal(fourth.ok, false);
    assert.equal(fourth.error, "rate_limited");
  });
});
