import type { Metadata } from "next";
import { SignupFlow } from "@/components/auth/SignupFlow";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { getUserLocale } from "@/i18n/server";

export const metadata: Metadata = { title: "Sign up", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const locale = await getUserLocale();
  return (
    <LocaleProvider locale={locale}>
      <div lang={locale} className="grid min-h-screen place-items-center bg-subtle px-4 py-10">
        <SignupFlow />
      </div>
    </LocaleProvider>
  );
}
