import { createHash, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { authSecret } from "./auth-secret";
import { prisma } from "./db";
import { sendSms } from "./sms";
import { createUserSession } from "./sessions";

const OTP_TTL_MS = 5 * 60 * 1000; // 5 min
const MAX_ATTEMPTS = 3; // wrong attempts before lockout
const LOCK_MS = 15 * 60 * 1000; // 15 min lockout
const MAX_SENDS = 3; // sends per phone per hour
const SEND_WINDOW_MS = 60 * 60 * 1000;

function hashCode(phone: string, code: string) {
  return createHash("sha256")
    .update(`${phone}:${code}:${authSecret()}`)
    .digest("hex");
}

function constantTimeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export type OtpSendResult = { ok: boolean; error?: "rate_limited" | "delivery_failed"; code?: string };

/** Generate + store an OTP and "send" it (mock SMS in dev). Rate-limited. */
export async function sendOtp(phone: string): Promise<OtpSendResult> {
  const now = new Date();
  const existing = await prisma.otpChallenge.findUnique({ where: { phone } });

  let sendCount = 1;
  let windowStart = now;
  if (existing && now.getTime() - existing.windowStart.getTime() < SEND_WINDOW_MS) {
    if (existing.sendCount >= MAX_SENDS) return { ok: false, error: "rate_limited" };
    sendCount = existing.sendCount + 1;
    windowStart = existing.windowStart;
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const expiresAt = new Date(now.getTime() + OTP_TTL_MS);
  await prisma.otpChallenge.upsert({
    where: { phone },
    create: { phone, codeHash: hashCode(phone, code), expiresAt, sendCount, windowStart },
    update: {
      codeHash: hashCode(phone, code),
      expiresAt,
      attempts: 0,
      lockedUntil: null,
      sendCount,
      windowStart,
    },
  });

  // Surface delivery failure instead of discarding it: reporting "code sent"
  // when Twilio rejected the message leaves the user waiting for an SMS that is
  // never coming, with no way to tell that retrying is the right move.
  const delivery = await sendSms(
    phone,
    `Your EduNomad verification code is ${code}. It expires in 5 minutes.`,
  );
  if (!delivery.ok) return { ok: false as const, error: "delivery_failed" as const };
  // Expose the code only outside production (dev UX + tests). Never in prod —
  // except the explicit E2E hook on disposable staging DBs (E2E_OTP_BYPASS),
  // which is never set in production environments.
  const expose = process.env.NODE_ENV !== "production" || process.env.E2E_OTP_BYPASS === "1";
  return { ok: true, code: expose ? code : undefined };
}

export type OtpVerifyResult = {
  ok: boolean;
  error?: "invalid" | "expired" | "locked" | "no_challenge";
  token?: string;
  userId?: string;
};

/** Verify an OTP; on success provision/find the user and open a session. */
export async function verifyOtp(phone: string, code: string): Promise<OtpVerifyResult> {
  const now = new Date();
  const ch = await prisma.otpChallenge.findUnique({ where: { phone } });
  if (!ch) return { ok: false, error: "no_challenge" };
  if (ch.lockedUntil && ch.lockedUntil > now) return { ok: false, error: "locked" };
  if (ch.expiresAt < now) return { ok: false, error: "expired" };

  if (!constantTimeEqual(ch.codeHash, hashCode(phone, code))) {
    const attempts = ch.attempts + 1;
    const lockedUntil = attempts >= MAX_ATTEMPTS ? new Date(now.getTime() + LOCK_MS) : null;
    await prisma.otpChallenge.update({ where: { phone }, data: { attempts, lockedUntil } });
    return { ok: false, error: lockedUntil ? "locked" : "invalid" };
  }

  const user = await findOrCreateUser(phone);
  const { token } = await createUserSession(user);
  await prisma.otpChallenge.delete({ where: { phone } });
  return { ok: true, token, userId: user.id };
}

/** Re-authentication: verify a fresh OTP without creating a session (used to
 *  confirm identity for high-stakes actions like a Compliance sign-off). */
export async function verifyOtpForReauth(phone: string, code: string): Promise<boolean> {
  const now = new Date();
  const ch = await prisma.otpChallenge.findUnique({ where: { phone } });
  if (!ch || (ch.lockedUntil && ch.lockedUntil > now) || ch.expiresAt < now) return false;
  if (!constantTimeEqual(ch.codeHash, hashCode(phone, code))) {
    const attempts = ch.attempts + 1;
    await prisma.otpChallenge.update({ where: { phone }, data: { attempts, lockedUntil: attempts >= MAX_ATTEMPTS ? new Date(now.getTime() + LOCK_MS) : null } });
    return false;
  }
  await prisma.otpChallenge.delete({ where: { phone } });
  return true;
}

/** First OTP login self-provisions a student-tenant user (tenant_id == self). */
async function findOrCreateUser(phone: string) {
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) return existing;
  const id = randomUUID();
  return prisma.user.create({
    data: { id, phone, tenant: "student", tenantId: id, role: "student" },
  });
}
