import { redirect } from "next/navigation";
import { getCurrentSession } from "./current-user";
import { logAudit } from "./audit";
import { twoFactorMandatory } from "./staff-2fa";
import type { SessionInfo } from "./sessions";

/**
 * Page guard for internal staff routes; redirects to the given login.
 *
 * A denial by an *authenticated* user is a permission denial and is recorded in
 * the audit log, which CLAUDE.md §6/§11/§17 require ("all RBAC denials log audit
 * entries") and which nothing previously did. Unauthenticated visits are not
 * logged — they are ordinary logged-out traffic, not an attempt to exceed
 * granted access, and logging them would bury real denials in noise.
 */
export async function requireStaff(
  roles: string[],
  loginPath = "/counsellor/login",
): Promise<SessionInfo> {
  const session = await getCurrentSession();
  if (!session) redirect(loginPath);
  if (!roles.includes(session.role)) {
    await logAudit({
      actorUserId: session.userId,
      action: "permission.denied",
      targetType: "Route",
      result: "denied",
      reason: `role ${session.role} not in [${roles.join(", ")}]`,
    });
    redirect(loginPath);
  }

  // §11: 2FA is mandatory for Compliance and Super Admin. Staff sign-in is an
  // SMS OTP — a single factor — so without this the role with sole legal
  // sign-off authority was protected by one code to one phone. An unenrolled
  // user is sent to enrol; an enrolled one whose session has not cleared the
  // challenge is sent to it.
  if (twoFactorMandatory(session.role) && !session.tfa) {
    // Land back on the console, not the login page they already cleared.
    const console = loginPath.replace(/\/login$/, "") || "/";
    redirect(`/staff/2fa?next=${encodeURIComponent(console)}`);
  }
  return session;
}
