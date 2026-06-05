import { randomBytes, createHash } from "node:crypto";
import type { Tenant, UserRole } from "@prisma/client";
import { prisma } from "./db";

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h
const IDLE_TTL_MS = 30 * 60 * 1000; // 30 min (internal roles)

export const SESSION_COOKIE = "en_session";

function hashToken(token: string) {
  return createHash("sha256")
    .update(`${token}:${process.env.AUTH_SECRET ?? "dev-insecure-secret"}`)
    .digest("hex");
}

export type SessionInfo = {
  id: string;
  userId: string;
  tenant: Tenant;
  role: UserRole;
  isInternal: boolean;
};

/** Create a server-side session; returns the raw token (store only its hash). */
export async function createUserSession(user: {
  id: string;
  tenant: Tenant;
  role: UserRole;
}): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("hex");
  const isInternal = user.tenant === "edunomad";
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      tenant: user.tenant,
      role: user.role,
      isInternal,
      expiresAt,
    },
  });
  return { token, expiresAt };
}

/**
 * Validate a session against the server-side store. Returns null when missing,
 * revoked, past 12h expiry, or (for internal roles) idle beyond 30 minutes.
 * Activity refreshes the idle clock.
 */
export async function validateUserSession(token: string): Promise<SessionInfo | null> {
  if (!token) return null;
  const s = await prisma.session.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!s || s.revokedAt) return null;

  const now = Date.now();
  if (s.expiresAt.getTime() < now) return null;
  if (s.isInternal && s.lastActiveAt.getTime() + IDLE_TTL_MS < now) return null;

  await prisma.session.update({ where: { id: s.id }, data: { lastActiveAt: new Date() } });
  return { id: s.id, userId: s.userId, tenant: s.tenant, role: s.role, isInternal: s.isInternal };
}

/** Invalidate a session server-side (logout). */
export async function destroyUserSession(token: string): Promise<void> {
  if (!token) return;
  await prisma.session.updateMany({
    where: { tokenHash: hashToken(token), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
