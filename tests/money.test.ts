import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/db";
import { payInvoice } from "../src/lib/payments";
import { createPayout, markPayoutPaid } from "../src/lib/finance";

/**
 * Money flows had no test coverage at all, which is how a double-charge and a
 * repeatable refund payment both survived. These exercise the concurrency and
 * replay paths specifically — the happy path was never the risk.
 */
// A real Student row: Invoice.studentId is now a foreign key, so the previous
// synthetic id would (correctly) be rejected by the database.
const STUDENT = "money-test-student";
const invoiceIds: string[] = [];
const payoutIds: string[] = [];
const commissionIds: string[] = [];

async function newInvoice(amount = 1000) {
  const inv = await prisma.invoice.create({
    data: { studentId: STUDENT, amountLocal: amount, currency: "BDT", amountUsd: 9, purpose: "test_fee" },
  });
  invoiceIds.push(inv.id);
  return inv;
}

describe("W4 — money flows are idempotent under replay and concurrency", () => {
  before(async () => {
    await prisma.student.upsert({
      where: { id: STUDENT },
      create: { id: STUDENT, tenantId: "student", phone: "+880000000money", fullName: "Money Test" },
      update: {},
    });
  });

  after(async () => {
    await prisma.payment.deleteMany({ where: { invoiceId: { in: invoiceIds } } });
    await prisma.invoice.deleteMany({ where: { id: { in: invoiceIds } } });
    await prisma.commission.deleteMany({ where: { id: { in: commissionIds } } });
    await prisma.payout.deleteMany({ where: { id: { in: payoutIds } } });
    await prisma.student.deleteMany({ where: { id: STUDENT } });
    await prisma.$disconnect();
  });

  it("charges an invoice exactly once when paid twice in sequence", async () => {
    const inv = await newInvoice();
    const first = await payInvoice(inv.id, "bkash", "tester");
    const second = await payInvoice(inv.id, "bkash", "tester");

    assert.equal(first.ok, true);
    assert.equal(second.ok, false, "a settled invoice must not be payable again");

    const succeeded = await prisma.payment.count({ where: { invoiceId: inv.id, status: "succeeded" } });
    assert.equal(succeeded, 1, "exactly one successful charge");
  });

  it("charges an invoice exactly once when two payments race", async () => {
    const inv = await newInvoice();
    const [a, b] = await Promise.all([
      payInvoice(inv.id, "bkash", "tester"),
      payInvoice(inv.id, "nagad", "tester"),
    ]);

    assert.equal([a.ok, b.ok].filter(Boolean).length, 1, "exactly one caller wins the race");
    const succeeded = await prisma.payment.count({ where: { invoiceId: inv.id, status: "succeeded" } });
    assert.equal(succeeded, 1, "a double-tap must not double-charge");
  });

  it("leaves the invoice payable when the gateway declines", async () => {
    const inv = await newInvoice();
    const res = await payInvoice(inv.id, "not_a_real_method", "tester");
    assert.equal(res.ok, false);

    const after = await prisma.invoice.findUniqueOrThrow({ where: { id: inv.id } });
    assert.notEqual(after.status, "paid", "a declined charge must release its claim");
    assert.equal((await payInvoice(inv.id, "bkash", "tester")).ok, true, "retry with another method works");
  });

  it("never puts one commission into two payouts", async () => {
    const inst = await prisma.institution.findFirst();
    const app = await prisma.application.findFirst();
    if (!inst || !app) return; // catalogue not seeded in this environment

    const c = await prisma.commission.create({
      data: {
        applicationId: `money-test-${Date.now()}`,
        institutionId: inst.id,
        ratePct: 10,
        amount: 1000,
        currency: "CAD",
        amountUsd: 730,
        status: "received",
      },
    });
    commissionIds.push(c.id);

    const [p1, p2] = await Promise.all([
      createPayout([c.id], "tester").catch(() => null),
      createPayout([c.id], "tester").catch(() => null),
    ]);
    for (const p of [p1, p2]) if (p) payoutIds.push(p.id);

    assert.equal([p1, p2].filter(Boolean).length, 1, "only one payout may claim the commission");
    const claimed = await prisma.commission.findUniqueOrThrow({ where: { id: c.id } });
    assert.equal(claimed.status, "reconciled");
  });

  it("marking a payout paid twice is a no-op the second time", async () => {
    const p = await prisma.payout.create({
      data: { reference: `PO-TEST-${Date.now()}`, amountUsd: 100, status: "scheduled" },
    });
    payoutIds.push(p.id);

    const first = await markPayoutPaid(p.id);
    const second = await markPayoutPaid(p.id);
    assert.equal(first.count, 1);
    assert.equal(second.count, 0, "an already-paid payout must not be re-stamped");
  });
});
