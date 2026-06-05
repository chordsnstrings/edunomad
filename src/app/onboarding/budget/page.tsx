import type { Metadata } from "next";
import { StepShell } from "@/components/onboarding/StepShell";
import { BudgetStep } from "@/components/onboarding/BudgetStep";
import { requireStudent } from "@/lib/require-student";

export const metadata: Metadata = { title: "Budget", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  const { student } = await requireStudent();
  return (
    <StepShell
      step={5}
      title="Your budget"
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
