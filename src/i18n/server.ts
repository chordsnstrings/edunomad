import { getCurrentSession } from "@/lib/current-user";
import { getMyStudent } from "@/lib/student";
import { cookies } from "next/headers";
import { detectLocale, LOCALE_COOKIE } from "./locale";
import { isLocale } from "./config";
import { getTranslator } from "./index";
import type { Locale } from "./config";

/**
 * Resolve the active locale for a server render: the signed-in customer's chosen
 * language (student.language), else the request's cookie / Accept-Language.
 */
export async function getUserLocale(): Promise<Locale> {
  // An explicit choice (the locale cookie, set by the language switcher) wins:
  // it is a deliberate action, and setLocale also persists it to the student
  // record. Otherwise fall back to the stored language, then the request.
  const store = await cookies();
  const chosen = store.get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;

  try {
    const session = await getCurrentSession();
    if (session) {
      const student = await getMyStudent(session.userId);
      if (student?.language) return student.language as Locale;
    }
  } catch {
    /* fall through to request-based detection */
  }
  return detectLocale();
}

/** Server translator bound to the active user/request locale. */
export async function getServerT() {
  const locale = await getUserLocale();
  return getTranslator(locale);
}
