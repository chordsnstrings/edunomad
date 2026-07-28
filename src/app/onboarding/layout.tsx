import { LocaleProvider } from "@/i18n/LocaleProvider";
import { getUserLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const locale = await getUserLocale();
  return (
    <LocaleProvider locale={locale}>
      {/* lang here (not on <html>) so assistive tech announces the step content in
          the student's language without forcing static pages to render dynamically. */}
      <div lang={locale}>{children}</div>
    </LocaleProvider>
  );
}
