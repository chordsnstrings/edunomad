import { cache } from "react";
import { cookies } from "next/headers";
import { validateUserSession, SESSION_COOKIE, type SessionInfo } from "./sessions";

/**
 * Resolve the current user session from the cookie (null if unauthenticated).
 *
 * Memoized per request: a layout guard, the page guard and any component that
 * needs the session all call this, and each call previously issued its own
 * session SELECT (plus a lastActiveAt UPDATE), so a single page render hit the
 * database two or more times for the same row.
 */
export const getCurrentSession = cache(
  async (): Promise<SessionInfo | null> => {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return validateUserSession(token);
  },
);
