import { LocaleProvider } from "@/i18n/LocaleProvider";
import { getUserLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const locale = await getUserLocale();
  return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
}
