"use server";

import { cookies } from "next/headers";
import { getCurrentSession } from "@/lib/current-user";
import { prisma } from "@/lib/db";
import type { Language } from "@prisma/client";
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

  // Persist a signed-in student's choice, so the language follows them to other
  // devices. student.language is otherwise write-once at signup and outranks the
  // cookie, which left students permanently stuck in the language they first
  // picked — in a product whose whole premise is four languages.
  const session = await getCurrentSession();
  if (session?.role === "student") {
    await prisma.student.updateMany({
      where: { userId: session.userId },
      data: { language: locale as Language },
    });
  }

  revalidatePath("/", "layout");
}
