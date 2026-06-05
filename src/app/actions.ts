"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { COUNTRY_COOKIE } from "@/lib/geo";
import { LOCALE_COOKIE } from "@/i18n/locale";
import { isLocale } from "@/i18n/config";

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

/** Set the UI language (manual override of detected locale). */
export async function setLocale(locale: string) {
  if (!isLocale(locale)) return;
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}
