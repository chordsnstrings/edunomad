"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { destroyUserSession, SESSION_COOKIE } from "@/lib/sessions";

export async function parentLogoutAction() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await destroyUserSession(token);
  store.delete(SESSION_COOKIE);
  redirect("/parent/login");
}
