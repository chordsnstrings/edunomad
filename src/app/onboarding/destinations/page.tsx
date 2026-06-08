import type { Metadata } from "next";
import { StepShell } from "@/components/onboarding/StepShell";
import { DestinationsStep } from "@/components/onboarding/DestinationsStep";
import { requireStudent } from "@/lib/require-student";
import { getTranslator } from "@/i18n";
import type { Locale } from "@/i18n/config";

export const metadata: Metadata = { title: "Destinations", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page() {
  const { student } = await requireStudent();
  const locale = student.language as Locale;
  const t = getTranslator(locale);
  return (
    <StepShell
      step={3}
      locale={locale}
      title={t("profile.step.destinations.title")}
      subtitle="Pick the countries you're open to, then rank them in order of preference."
      backHref="/onboarding/english"
      nextHref="/onboarding/field"
    >
      <DestinationsStep initial={student.destinations as string[] | null} />
    </StepShell>
  );
}
