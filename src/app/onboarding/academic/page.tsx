import type { Metadata } from "next";
import { StepShell } from "@/components/onboarding/StepShell";
import { AcademicStep } from "@/components/onboarding/AcademicStep";
import { requireStudent } from "@/lib/require-student";
import { getTranslator } from "@/i18n";
import type { Locale } from "@/i18n/config";

export const metadata: Metadata = { title: "Academic background", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  const { student } = await requireStudent();
  const locale = student.language as Locale;
  const t = getTranslator(locale);
  return (
    <StepShell
      step={1}
      locale={locale}
      title={t("profile.step.academic.title")}
      subtitle="This helps us judge eligibility accurately. Be honest — it's saved as you go."
      nextHref="/onboarding/english"
    >
      <AcademicStep initial={student.academic as Record<string, never> | null} />
    </StepShell>
  );
}
