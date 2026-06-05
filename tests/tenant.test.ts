import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db";
import { withTenantScope, type TenantContext } from "../src/lib/tenant";

const A: TenantContext = { tenant: "edunomad", tenantId: "tenant-A-test" };
const phoneA = "+880000000A";
const phoneB = "+880000000B";

describe("G004 — multi-tenant scoping", () => {
  let userBId = "";

  before(async () => {
    await prisma.user.deleteMany({ where: { phone: { in: [phoneA, phoneB] } } });
    await prisma.user.create({
      data: { tenant: "edunomad", tenantId: A.tenantId, role: "counsellor", phone: phoneA },
    });
    const b = await prisma.user.create({
      data: { tenant: "agency", tenantId: "tenant-B-test", role: "agency_owner", phone: phoneB },
    });
    userBId = b.id;
  });

  after(async () => {
    await prisma.user.deleteMany({ where: { phone: { in: [phoneA, phoneB] } } });
    await prisma.$disconnect();
  });

  it("scopes list queries to the caller's tenant", async () => {
    const rows = await prisma.user.findMany({
      where: withTenantScope(A, { phone: { in: [phoneA, phoneB] } }),
    });
    assert.equal(rows.length, 1);
    assert.equal(rows[0].phone, phoneA);
  });

  it("returns an empty set for a cross-tenant lookup without explicit allow", async () => {
    const found = await prisma.user.findFirst({
      where: withTenantScope(A, { id: userBId }),
    });
    assert.equal(found, null);
  });

  it("allows cross-tenant access only when explicitly opted in", async () => {
    const found = await prisma.user.findFirst({
      where: withTenantScope(A, { id: userBId }, { crossTenant: true }),
    });
    assert.equal(found?.id, userBId);
  });
});
