import type { Metadata } from "next";
import { StepShell } from "@/components/onboarding/StepShell";
import { IntakeStep } from "@/components/onboarding/IntakeStep";
import { requireStudent } from "@/lib/require-student";
import { submitProfileAction } from "../actions";

export const metadata: Metadata = { title: "Intake target", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  const { student } = await requireStudent();
  return (
    <StepShell
      step={6}
      title="When do you want to start?"
      subtitle="This is the last step — then we'll show your matches."
      backHref="/onboarding/budget"
    >
      <IntakeStep initial={student.intakeTarget as Record<string, unknown> | null} />
      <form action={submitProfileAction} className="mt-8">
        <button
          type="submit"
          className="w-full rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-700"
        >
          See my matches
        </button>
      </form>
    </StepShell>
  );
}
