import type { Metadata } from "next";
import { StepShell } from "@/components/onboarding/StepShell";
import { FieldStep } from "@/components/onboarding/FieldStep";
import { requireStudent } from "@/lib/require-student";
import { getTranslator } from "@/i18n";
import type { Locale } from "@/i18n/config";

export const metadata: Metadata = { title: "Field of study", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  const { student } = await requireStudent();
  const locale = student.language as Locale;
  const t = getTranslator(locale);
  return (
    <StepShell
      step={4}
      locale={locale}
      title={t("profile.step.field.title")}
      subtitle="Choose a broad area, then a specific field."
      backHref="/onboarding/destinations"
      nextHref="/onboarding/budget"
    >
      <FieldStep
        initial={{ fieldCategory: student.fieldCategory ?? undefined, fieldOfStudy: student.fieldOfStudy ?? undefined }}
      />
    </StepShell>
  );
}
