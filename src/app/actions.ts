"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { COUNTRY_COOKIE } from "@/lib/geo";

/** Persist a manual country override (or clear it to fall back to IP geo). */
export async function setCountry(code: string) {
  const store = await cookies();
  if (!code) {
    store.delete(COUNTRY_COOKIE);
  } else {
    store.set(COUNTRY_COOKIE, code.toUpperCase(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  revalidatePath("/", "layout");
}
