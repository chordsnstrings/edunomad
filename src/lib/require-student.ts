import { redirect } from "next/navigation";
import { getCurrentSession } from "./current-user";
import { getMyStudent } from "./student";

/** Page guard: resolve the signed-in student or redirect to signup/welcome. */
export async function requireStudent() {
  const session = await getCurrentSession();
  if (!session) redirect("/signup");
  const student = await getMyStudent(session.userId);
  if (!student) redirect("/welcome");
  return { session, student };
}
