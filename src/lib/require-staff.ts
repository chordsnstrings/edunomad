import { redirect } from "next/navigation";
import { getCurrentSession } from "./current-user";
import { logAudit } from "./audit";
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
  return session;
}
