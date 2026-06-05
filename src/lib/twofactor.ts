import { createHash, randomBytes } from "node:crypto";
import { prisma } from "./db";
import { generateSecret, verifyTotp, otpauthUri } from "./totp";
import { logAudit } from "./audit";

/** 2FA is mandatory for these internal roles (CLAUDE.md §11). */
export function mustEnrollTwoFactor(role: string): boolean {
  return role === "super_admin" || role === "compliance";
}

function hashRecovery(code: string) {
  return createHash("sha256")
    .update(`${code.trim()}:${process.env.AUTH_SECRET ?? "dev-insecure-secret"}`)
    .digest("hex");
}

export function generateRecoveryCodes(n = 8): string[] {
  return Array.from({ length: n }, () => randomBytes(5).toString("hex"));
}

/** Start enrolment: store a pending secret + hashed recovery codes, return the
 *  plaintext secret/URI/codes to display once. */
export async function beginEnrollment(adminId: string, accountLabel: string) {
  const secret = generateSecret();
  const recoveryCodes = generateRecoveryCodes();
  await prisma.adminUser.update({
    where: { id: adminId },
    data: { totpSecret: secret, totpEnabledAt: null, recoveryCodes: recoveryCodes.map(hashRecovery) },
  });
  return { secret, uri: otpauthUri(secret, accountLabel), recoveryCodes };
}

/** Confirm enrolment by verifying a code against the pending secret. */
export async function confirmEnrollment(adminId: string, token: string): Promise<boolean> {
  const u = await prisma.adminUser.findUnique({ where: { id: adminId } });
  if (!u?.totpSecret) return false;
  if (!verifyTotp(u.totpSecret, token)) return false;
  await prisma.adminUser.update({ where: { id: adminId }, data: { totpEnabledAt: new Date() } });
  return true;
}

/** Verify a login 2FA challenge: TOTP code or a one-time recovery code. */
export async function verifyTwoFactor(adminId: string, token: string): Promise<boolean> {
  const u = await prisma.adminUser.findUnique({ where: { id: adminId } });
  if (!u?.totpSecret || !u.totpEnabledAt) return false;
  if (verifyTotp(u.totpSecret, token)) return true;
  const h = hashRecovery(token);
  if (u.recoveryCodes.includes(h)) {
    await prisma.adminUser.update({
      where: { id: adminId },
      data: { recoveryCodes: u.recoveryCodes.filter((c) => c !== h) },
    });
    return true;
  }
  return false;
}

export async function isTwoFactorEnabled(adminId: string): Promise<boolean> {
  const u = await prisma.adminUser.findUnique({
    where: { id: adminId },
    select: { totpEnabledAt: true },
  });
  return !!u?.totpEnabledAt;
}

/** Disable 2FA — logged to the audit trail (CLAUDE.md §6). */
export async function disableTwoFactor(adminId: string, actorUserId: string) {
  await prisma.adminUser.update({
    where: { id: adminId },
    data: { totpSecret: null, totpEnabledAt: null, recoveryCodes: [] },
  });
  await logAudit({
    actorUserId,
    action: "two_factor.disabled",
    targetType: "AdminUser",
    targetId: adminId,
    result: "success",
    reason: "2FA disabled",
  });
}
