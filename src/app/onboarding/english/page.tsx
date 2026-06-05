import type { Metadata } from "next";
import { StepShell } from "@/components/onboarding/StepShell";
import { EnglishStep } from "@/components/onboarding/EnglishStep";
import { requireStudent } from "@/lib/require-student";

export const metadata: Metadata = { title: "English proficiency", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  const { student } = await requireStudent();
  return (
    <StepShell
      step={2}
      title="English proficiency"
      subtitle="There's a pathway for every level — including no test yet."
      backHref="/onboarding/academic"
      nextHref="/onboarding/destinations"
    >
      <EnglishStep initial={student.englishProficiency as Record<string, unknown> | null} />
    </StepShell>
  );
}
