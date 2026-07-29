import { randomBytes, createHash } from "node:crypto";
import { authSecret } from "./auth-secret";
import type { Tenant, UserRole } from "@prisma/client";
import { prisma } from "./db";

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h
const IDLE_TTL_MS = 30 * 60 * 1000; // 30 min (internal roles)
// Only refresh the idle clock at most once a minute (see validateUserSession).
const LAST_ACTIVE_WRITE_MS = 60 * 1000;

export const SESSION_COOKIE = "en_session";

function hashToken(token: string) {
  return createHash("sha256")
    .update(`${token}:${authSecret()}`)
    .digest("hex");
}

export type SessionInfo = {
  id: string;
  userId: string;
  tenant: Tenant;
  role: UserRole;
  isInternal: boolean;
  /** Whether this session has satisfied its second factor (CLAUDE.md §11). */
  tfa: boolean;
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
  const s = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { status: true } } },
  });
  if (!s || s.revokedAt) return null;
  // A deactivated or archived user must not keep an active session. The status
  // column existed but nothing ever checked it, so soft-deleting someone left
  // their sessions working until natural expiry.
  if (s.user.status !== "active") return null;

  const now = Date.now();
  if (s.expiresAt.getTime() < now) return null;
  if (s.isInternal && s.lastActiveAt.getTime() + IDLE_TTL_MS < now) return null;

  // Throttle the idle-clock write. Refreshing lastActiveAt on literally every
  // request meant a Postgres UPDATE per page view (and per API call) purely for
  // bookkeeping. A minute of granularity is immaterial against a 30-minute idle
  // timeout and removes almost all of that write load.
  if (now - s.lastActiveAt.getTime() > LAST_ACTIVE_WRITE_MS) {
    await prisma.session.update({ where: { id: s.id }, data: { lastActiveAt: new Date() } });
  }
  return { id: s.id, userId: s.userId, tenant: s.tenant, role: s.role, isInternal: s.isInternal, tfa: s.tfa };
}

/** Invalidate a session server-side (logout). */
export async function destroyUserSession(token: string): Promise<void> {
  if (!token) return;
  await prisma.session.updateMany({
    where: { tokenHash: hashToken(token), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
