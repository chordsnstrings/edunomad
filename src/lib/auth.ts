import "server-only";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import {
  signSession,
  verifySession,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  type SessionPayload,
} from "./session";

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

/** Read and verify the current admin session, if any. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

export async function startSession(user: {
  id: string;
  email: string;
  name: string;
  role: string;
  tfa?: boolean;
}) {
  const token = await signSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tfa: user.tfa === true,
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/**
 * Authenticate by email + password against the AdminUser table.
 * Returns the session payload on success, or null on failure.
 */
export async function authenticate(
  email: string,
  password: string,
): Promise<SessionPayload | null> {
  const user = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (!user) {
    // Constant-time-ish: still run a hash to avoid trivial user enumeration.
    await bcrypt.compare(password, "$2a$10$invalidinvalidinvalidinvalidinv");
    return null;
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  return { sub: user.id, email: user.email, name: user.name, role: user.role };
}
