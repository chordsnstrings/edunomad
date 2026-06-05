import type { Metadata } from "next";
import { StepShell } from "@/components/onboarding/StepShell";
import { DestinationsStep } from "@/components/onboarding/DestinationsStep";
import { requireStudent } from "@/lib/require-student";

export const metadata: Metadata = { title: "Destinations", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  const { student } = await requireStudent();
  return (
    <StepShell
      step={3}
      title="Where do you want to study?"
      subtitle="Pick the countries you're open to, then rank them in order of preference."
      backHref="/onboarding/english"
      nextHref="/onboarding/field"
    >
      <DestinationsStep initial={student.destinations as string[] | null} />
    </StepShell>
  );
}
