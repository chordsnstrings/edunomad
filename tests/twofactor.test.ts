import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db";
import {
  beginEnrollment,
  confirmEnrollment,
  verifyTwoFactor,
  disableTwoFactor,
  isTwoFactorEnabled,
  mustEnrollTwoFactor,
} from "../src/lib/twofactor";
import { totp } from "../src/lib/totp";

const ADMIN_ID = "tfa-test-admin";

describe("G011 — two-factor enrolment + verification", () => {
  before(async () => {
    await prisma.adminUser.deleteMany({ where: { id: ADMIN_ID } });
    await prisma.adminUser.create({
      data: { id: ADMIN_ID, email: "tfa-test@edunomad.app", name: "T", passwordHash: "x", role: "compliance" },
    });
  });

  after(async () => {
    await prisma.adminUser.deleteMany({ where: { id: ADMIN_ID } });
    await prisma.$executeRawUnsafe(`ALTER TABLE "AuditLog" DISABLE TRIGGER USER`);
    await prisma.auditLog.deleteMany({ where: { targetId: ADMIN_ID } });
    await prisma.$executeRawUnsafe(`ALTER TABLE "AuditLog" ENABLE TRIGGER USER`);
    await prisma.$disconnect();
  });

  it("marks mandatory roles", () => {
    assert.equal(mustEnrollTwoFactor("super_admin"), true);
    assert.equal(mustEnrollTwoFactor("compliance"), true);
    assert.equal(mustEnrollTwoFactor("counsellor"), false);
  });

  it("enrols, confirms, verifies, and consumes recovery codes", async () => {
    const e = await beginEnrollment(ADMIN_ID, "tfa-test@edunomad.app");
    assert.equal(e.recoveryCodes.length, 8);
    assert.equal(await isTwoFactorEnabled(ADMIN_ID), false);

    assert.equal(await confirmEnrollment(ADMIN_ID, "000000"), false);
    assert.equal(await confirmEnrollment(ADMIN_ID, totp(e.secret)), true);
    assert.equal(await isTwoFactorEnabled(ADMIN_ID), true);

    assert.equal(await verifyTwoFactor(ADMIN_ID, totp(e.secret)), true);
    assert.equal(await verifyTwoFactor(ADMIN_ID, e.recoveryCodes[0]), true);
    assert.equal(await verifyTwoFactor(ADMIN_ID, e.recoveryCodes[0]), false); // consumed
  });

  it("disables and logs to the audit trail", async () => {
    await disableTwoFactor(ADMIN_ID, ADMIN_ID);
    assert.equal(await isTwoFactorEnabled(ADMIN_ID), false);
    const audit = await prisma.auditLog.findFirst({
      where: { targetId: ADMIN_ID, action: "two_factor.disabled" },
    });
    assert.notEqual(audit, null);
  });
});
