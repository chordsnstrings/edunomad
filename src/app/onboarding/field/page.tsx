import type { Metadata } from "next";
import { StepShell } from "@/components/onboarding/StepShell";
import { FieldStep } from "@/components/onboarding/FieldStep";
import { requireStudent } from "@/lib/require-student";

export const metadata: Metadata = { title: "Field of study", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  const { student } = await requireStudent();
  return (
    <StepShell
      step={4}
      title="What do you want to study?"
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
