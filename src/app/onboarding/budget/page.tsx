import type { Metadata } from "next";
import { StepShell } from "@/components/onboarding/StepShell";
import { BudgetStep } from "@/components/onboarding/BudgetStep";
import { requireStudent } from "@/lib/require-student";
import { getTranslator } from "@/i18n";
import type { Locale } from "@/i18n/config";

export const metadata: Metadata = { title: "Budget", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  const { student } = await requireStudent();
  const locale = student.language as Locale;
  const t = getTranslator(locale);
  return (
    <StepShell
      step={5}
      locale={locale}
      title={t("profile.step.budget.title")}
      subtitle="Annual budget in USD — tuition plus living costs."
      backHref="/onboarding/field"
      nextHref="/onboarding/intake"
    >
      <BudgetStep
        initial={{ min: student.budgetMinUsd, max: student.budgetMaxUsd, funding: student.fundingSource }}
      />
    </StepShell>
  );
}
