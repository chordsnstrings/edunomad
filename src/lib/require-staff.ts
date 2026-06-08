import { redirect } from "next/navigation";
import { getCurrentSession } from "./current-user";
import type { SessionInfo } from "./sessions";

/** Page guard for internal staff routes; redirects to the given login. */
export async function requireStaff(
  roles: string[],
  loginPath = "/counsellor/login",
): Promise<SessionInfo> {
  const session = await getCurrentSession();
  if (!session || !roles.includes(session.role)) redirect(loginPath);
  return session;
}
