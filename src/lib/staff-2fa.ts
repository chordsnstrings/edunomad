import { createHash, randomBytes } from "node:crypto";
import { authSecret } from "./auth-secret";
import { prisma } from "./db";
import { generateSecret, verifyTotp, otpauthUri } from "./totp";
import { logAudit } from "./audit";

/**
 * Second factor for staff `User` accounts.
 *
 * The existing two-factor module covers `AdminUser` — the separate admin
 * console — only. Everyone else, Compliance included, signed in with an SMS OTP
 * and nothing else: one factor, on the one role whose sign-off carries legal
 * weight and whose refusal authority §1.12 makes absolute. §11 says 2FA is
 * available to every internal role and mandatory for Compliance and Super
 * Admin; this is the staff-side half of that.
 */

/** Roles that cannot reach their console without a second factor (§11). */
const MANDATORY_ROLES = new Set(["compliance", "super_admin"]);

/** Roles that may enrol voluntarily — every internal role (§11). */
const INTERNAL_ROLES = new Set([
  "super_admin",
  "education_manager",
  "counsellor_manager",
  "counsellor",
  "operations_manager",
  "operations_team",
  "compliance",
  "finance",
]);

export function twoFactorMandatory(role: string): boolean {
  return MANDATORY_ROLES.has(role);
}

export function twoFactorAvailable(role: string): boolean {
  return INTERNAL_ROLES.has(role);
}

function hashRecovery(code: string) {
  return createHash("sha256").update(`${code.trim()}:${authSecret()}`).digest("hex");
}

export function generateRecoveryCodes(n = 8): string[] {
  return Array.from({ length: n }, () => randomBytes(5).toString("hex"));
}

/** Start enrolment: store a pending secret + hashed recovery codes. The
 *  plaintext secret and codes are returned once and never stored in the clear. */
export async function beginStaffEnrollment(userId: string, accountLabel: string) {
  const secret = generateSecret();
  const recoveryCodes = generateRecoveryCodes();
  await prisma.user.update({
    where: { id: userId },
    data: {
      totpSecret: secret,
      totpEnabledAt: null,
      recoveryCodes: recoveryCodes.map(hashRecovery),
    },
  });
  return { secret, uri: otpauthUri(secret, accountLabel), recoveryCodes };
}

/** Confirm enrolment by verifying a code against the pending secret. */
export async function confirmStaffEnrollment(userId: string, token: string): Promise<boolean> {
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u?.totpSecret || u.totpEnabledAt) return false;
  if (!verifyTotp(u.totpSecret, token)) return false;
  await prisma.user.update({ where: { id: userId }, data: { totpEnabledAt: new Date() } });
  await logAudit({
    actorUserId: userId,
    action: "two_factor.enrolled",
    targetType: "User",
    targetId: userId,
    result: "success",
  });
  return true;
}

export async function staffTwoFactorEnabled(userId: string): Promise<boolean> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { totpEnabledAt: true },
  });
  return !!u?.totpEnabledAt;
}

/**
 * Verify a login challenge: a TOTP code, or a one-time recovery code which is
 * consumed. A consumed recovery code is removed conditionally, so two parallel
 * submissions of the same code cannot both succeed.
 */
export async function verifyStaffTwoFactor(userId: string, token: string): Promise<boolean> {
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u?.totpSecret || !u.totpEnabledAt) return false;
  if (verifyTotp(u.totpSecret, token)) return true;

  const h = hashRecovery(token);
  if (!u.recoveryCodes.includes(h)) return false;
  const consumed = await prisma.user.updateMany({
    where: { id: userId, recoveryCodes: { has: h } },
    data: { recoveryCodes: u.recoveryCodes.filter((c) => c !== h) },
  });
  if (consumed.count !== 1) return false;
  await logAudit({
    actorUserId: userId,
    action: "two_factor.recovery_used",
    targetType: "User",
    targetId: userId,
    result: "success",
    reason: `${u.recoveryCodes.length - 1} codes remaining`,
  });
  return true;
}

/** Mark this session as having satisfied the second factor. */
export async function markSessionTwoFactor(sessionId: string) {
  await prisma.session.update({ where: { id: sessionId }, data: { tfa: true } });
}

/** Disable 2FA for a staff user — audited (§6 privileged actions). */
export async function disableStaffTwoFactor(userId: string, actorUserId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { totpSecret: null, totpEnabledAt: null, recoveryCodes: [] },
  });
  // Every existing session loses its second-factor claim: leaving them marked
  // would let a session outlive the enrolment that justified it.
  await prisma.session.updateMany({ where: { userId, tfa: true }, data: { tfa: false } });
  await logAudit({
    actorUserId,
    action: "two_factor.disabled",
    targetType: "User",
    targetId: userId,
    result: "success",
    reason: "staff 2FA disabled",
  });
}
