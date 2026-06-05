import { cookies } from "next/headers";
import { destroyUserSession, SESSION_COOKIE } from "@/lib/sessions";

export const dynamic = "force-dynamic";

export async function POST() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await destroyUserSession(token);
  store.delete(SESSION_COOKIE);
  return Response.json({ ok: true });
}
