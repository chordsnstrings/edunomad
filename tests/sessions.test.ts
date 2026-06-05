import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db";
import { createUserSession, validateUserSession, destroyUserSession } from "../src/lib/sessions";

const STUDENT_ID = "sess-test-student";
const INTERNAL_ID = "sess-test-internal";

async function latestSessionId(userId: string) {
  const s = await prisma.session.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
  return s!.id;
}

describe("G009 — session management + idle timeout", () => {
  before(async () => {
    await prisma.session.deleteMany({ where: { userId: { in: [STUDENT_ID, INTERNAL_ID] } } });
    await prisma.user.deleteMany({ where: { id: { in: [STUDENT_ID, INTERNAL_ID] } } });
    await prisma.user.create({ data: { id: STUDENT_ID, phone: "+8802000000001", tenant: "student", tenantId: STUDENT_ID, role: "student" } });
    await prisma.user.create({ data: { id: INTERNAL_ID, phone: "+8802000000002", tenant: "edunomad", tenantId: "edu", role: "counsellor" } });
  });

  after(async () => {
    await prisma.session.deleteMany({ where: { userId: { in: [STUDENT_ID, INTERNAL_ID] } } });
    await prisma.user.deleteMany({ where: { id: { in: [STUDENT_ID, INTERNAL_ID] } } });
    await prisma.$disconnect();
  });

  it("validates a fresh session against the server store", async () => {
    const { token } = await createUserSession({ id: STUDENT_ID, tenant: "student", role: "student" });
    const info = await validateUserSession(token);
    assert.equal(info?.userId, STUDENT_ID);
    assert.equal(info?.isInternal, false);
  });

  it("rejects an expired session (12h)", async () => {
    const { token } = await createUserSession({ id: STUDENT_ID, tenant: "student", role: "student" });
    await prisma.session.update({
      where: { id: await latestSessionId(STUDENT_ID) },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    assert.equal(await validateUserSession(token), null);
  });

  it("rejects an idle internal session (30 min) but refreshes on activity", async () => {
    const { token } = await createUserSession({ id: INTERNAL_ID, tenant: "edunomad", role: "counsellor" });
    // Fresh internal session validates and refreshes lastActiveAt.
    assert.notEqual(await validateUserSession(token), null);
    // Simulate 31 minutes idle.
    await prisma.session.update({
      where: { id: await latestSessionId(INTERNAL_ID) },
      data: { lastActiveAt: new Date(Date.now() - 31 * 60 * 1000) },
    });
    assert.equal(await validateUserSession(token), null);
  });

  it("invalidates on logout", async () => {
    const { token } = await createUserSession({ id: STUDENT_ID, tenant: "student", role: "student" });
    await destroyUserSession(token);
    assert.equal(await validateUserSession(token), null);
  });
});
