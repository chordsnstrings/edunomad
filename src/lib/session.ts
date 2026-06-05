// Edge-safe session helpers (jose only — no Node APIs, no Prisma).
// Safe to import from middleware.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "en_admin";
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12h, matches CLAUDE.md §11

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
};

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s && process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production");
  }
  return new TextEncoder().encode(s || "dev-insecure-secret-do-not-use");
}

export async function signSession(
  payload: SessionPayload,
  maxAgeSec = SESSION_MAX_AGE,
) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSec}s`)
    .sign(secret());
}

export async function verifySession(
  token?: string,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role: String(payload.role),
    };
  } catch {
    return null;
  }
}
