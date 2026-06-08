import type { Metadata } from "next";
import { StepShell } from "@/components/onboarding/StepShell";
import { EnglishStep } from "@/components/onboarding/EnglishStep";
import { requireStudent } from "@/lib/require-student";
import { getTranslator } from "@/i18n";
import type { Locale } from "@/i18n/config";

export const metadata: Metadata = { title: "English proficiency", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  const { student } = await requireStudent();
  const locale = student.language as Locale;
  const t = getTranslator(locale);
  return (
    <StepShell
      step={2}
      locale={locale}
      title={t("profile.step.english.title")}
      subtitle="There's a pathway for every level — including no test yet."
      backHref="/onboarding/academic"
      nextHref="/onboarding/destinations"
    >
      <EnglishStep initial={student.englishProficiency as Record<string, unknown> | null} />
    </StepShell>
  );
}
