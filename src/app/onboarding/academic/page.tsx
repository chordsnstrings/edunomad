import type { Metadata } from "next";
import { StepShell } from "@/components/onboarding/StepShell";
import { AcademicStep } from "@/components/onboarding/AcademicStep";
import { requireStudent } from "@/lib/require-student";

export const metadata: Metadata = { title: "Academic background", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  const { student } = await requireStudent();
  return (
    <StepShell
      step={1}
      title="Your academic background"
      subtitle="This helps us judge eligibility accurately. Be honest — it's saved as you go."
      nextHref="/onboarding/english"
    >
      <AcademicStep initial={student.academic as Record<string, never> | null} />
    </StepShell>
  );
}
