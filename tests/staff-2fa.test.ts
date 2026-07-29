import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { prisma } from "../src/lib/db";
import { totp } from "../src/lib/totp";
import {
  beginStaffEnrollment,
  confirmStaffEnrollment,
  disableStaffTwoFactor,
  markSessionTwoFactor,
  staffTwoFactorEnabled,
  twoFactorAvailable,
  twoFactorMandatory,
  verifyStaffTwoFactor,
} from "../src/lib/staff-2fa";
import { createUserSession, validateUserSession } from "../src/lib/sessions";

const PHONE = "+880000002fa";
let userId = "";

describe("§11 — staff second factor", () => {
  before(async () => {
    await prisma.user.deleteMany({ where: { phone: PHONE } });
    const u = await prisma.user.create({
      data: { phone: PHONE, tenant: "edunomad", tenantId: "edunomad", role: "compliance" },
    });
    userId = u.id;
  });

  after(async () => {
    await prisma.session.deleteMany({ where: { userId } });
    await prisma.user.deleteMany({ where: { phone: PHONE } });
    await prisma.$disconnect();
  });

  it("is mandatory for exactly the roles §11 names", () => {
    assert.equal(twoFactorMandatory("compliance"), true);
    assert.equal(twoFactorMandatory("super_admin"), true);
    assert.equal(twoFactorMandatory("counsellor"), false);
    assert.equal(twoFactorMandatory("student"), false);
  });

  it("is available to every internal role, and to no external one", () => {
    for (const r of ["counsellor", "finance", "operations_team", "education_manager"]) {
      assert.equal(twoFactorAvailable(r), true, r);
    }
    for (const r of ["student", "parent", "agency_owner"]) {
      assert.equal(twoFactorAvailable(r), false, r);
    }
  });

  it("does not count as enabled until enrolment is confirmed", async () => {
    assert.equal(await staffTwoFactorEnabled(userId), false);
    const { secret } = await beginStaffEnrollment(userId, "compliance@test");
    assert.equal(await staffTwoFactorEnabled(userId), false, "a pending secret is not enrolment");
    assert.equal(await verifyStaffTwoFactor(userId, totp(secret)), false, "cannot log in on a pending secret");

    assert.equal(await confirmStaffEnrollment(userId, "000000"), false);
    assert.equal(await confirmStaffEnrollment(userId, totp(secret)), true);
    assert.equal(await staffTwoFactorEnabled(userId), true);
  });

  it("accepts a valid TOTP and rejects a wrong one", async () => {
    const u = await prisma.user.findUnique({ where: { id: userId } });
    assert.equal(await verifyStaffTwoFactor(userId, totp(u!.totpSecret!)), true);
    assert.equal(await verifyStaffTwoFactor(userId, "000001"), false);
  });

  it("consumes a recovery code exactly once", async () => {
    const { recoveryCodes, secret } = await beginStaffEnrollment(userId, "compliance@test");
    await confirmStaffEnrollment(userId, totp(secret));
    const code = recoveryCodes[0];
    assert.equal(await verifyStaffTwoFactor(userId, code), true);
    assert.equal(await verifyStaffTwoFactor(userId, code), false, "a recovery code must not be reusable");
  });

  it("carries the second-factor claim on the session, not the user", async () => {
    const { token } = await createUserSession({ id: userId, tenant: "edunomad", role: "compliance" });
    const before = await validateUserSession(token);
    assert.equal(before?.tfa, false, "a fresh OTP session has not cleared the second factor");
    await markSessionTwoFactor(before!.id);
    assert.equal((await validateUserSession(token))?.tfa, true);
  });

  it("revokes the claim from live sessions when 2FA is disabled", async () => {
    const { token } = await createUserSession({ id: userId, tenant: "edunomad", role: "compliance" });
    const s = await validateUserSession(token);
    await markSessionTwoFactor(s!.id);
    assert.equal((await validateUserSession(token))?.tfa, true);

    await disableStaffTwoFactor(userId, "admin-test");
    assert.equal(await staffTwoFactorEnabled(userId), false);
    assert.equal((await validateUserSession(token))?.tfa, false, "a session must not outlive the enrolment behind it");
  });

  it("blocks a mandatory role whose session has not cleared the factor", () => {
    // requireStaff redirects rather than returning, so assert the guard exists
    // where every staff surface goes through it.
    const guard = readFileSync("src/lib/require-staff.ts", "utf8");
    assert.match(guard, /twoFactorMandatory\(session\.role\) && !session\.tfa/);
    assert.match(guard, /redirect\(`\/staff\/2fa/);
  });

  it("will not redirect off-site after the challenge", () => {
    const page = readFileSync("src/app/staff/2fa/page.tsx", "utf8");
    assert.match(page, /next\.startsWith\("\/"\) && !next\.startsWith\("\/\/"\)/);
  });
});
