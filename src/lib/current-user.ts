import { cookies } from "next/headers";
import { validateUserSession, SESSION_COOKIE, type SessionInfo } from "./sessions";

/** Resolve the current user session from the cookie (null if unauthenticated). */
export async function getCurrentSession(): Promise<SessionInfo | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return validateUserSession(token);
}
