import { getCurrentSession } from "@/lib/current-user";
import { getMyStudent } from "@/lib/student";
import { detectLocale } from "./locale";
import { getTranslator } from "./index";
import type { Locale } from "./config";

/**
 * Resolve the active locale for a server render: the signed-in customer's chosen
 * language (student.language), else the request's cookie / Accept-Language.
 */
export async function getUserLocale(): Promise<Locale> {
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
