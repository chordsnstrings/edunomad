import { redirect } from "next/navigation";
import { getSession } from "./auth";
import type { SessionPayload } from "./session";

/**
 * Admin guard for pages and server actions: signed in AND 2FA satisfied.
 *
 * The 2FA gate used to live only in the dashboard layout, which does not protect
 * server actions or route handlers — those are directly invokable endpoints. Every
 * privileged admin entry point must call this so a password-only (pre-2FA) session
 * cannot mutate settings, export the audit log, or run a DSAR erasure
 * (CLAUDE.md §11: 2FA mandatory for Super Admin + Compliance).
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!session.tfa) redirect("/admin/2fa");
  return session;
}

/**
 * Non-redirecting variant for route handlers. Returns null when the caller is not
 * a fully authenticated (2FA-satisfied) admin, so the handler can answer 401/403.
 */
export async function getAdminSession(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session || !session.tfa) return null;
  return session;
}
