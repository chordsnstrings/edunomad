import type { Metadata } from "next";
import { requireStudent } from "@/lib/require-student";
import { prisma } from "@/lib/db";
import { runEligibility, type StudentProfile } from "@/lib/eligibility";
import { emit } from "@/lib/events";
import { EligibilityResults } from "@/components/eligibility/EligibilityResults";
import { EmptyState } from "@/components/ui/EmptyState";
import { getTranslator, clientMessages } from "@/i18n";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import type { Locale } from "@/i18n/config";

export const metadata: Metadata = { title: "Your matches", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EligibilityPage() {
  const { student, session } = await requireStudent();
  const locale = student.language as Locale;
  const t = getTranslator(locale);
  const profile: StudentProfile = {
    academic: student.academic as StudentProfile["academic"],
    englishProficiency: student.englishProficiency as StudentProfile["englishProficiency"],
    budgetMaxUsd: student.budgetMaxUsd,
    destinations: student.destinations as string[] | null,
    fieldCategory: student.fieldCategory,
  };
  const result = await runEligibility(profile);
  // Emit at most once per hour per student. This is a GET render, and every
  // refresh previously took the global chain advisory lock to append a duplicate
  // eligibility.checked event.
  const recent = await prisma.event.findFirst({
    where: {
      studentId: student.id,
      type: "eligibility.checked",
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
    },
    select: { id: true },
  });
  if (!recent) await emit({
    type: "eligibility.checked",
    stage: 1,
    studentId: student.id,
    actorType: "student",
    actorId: session.userId,
    visibility: { S: true, C: true, CM: true },
    channels: { in_app: true },
    payload: { total: result.total, countries: result.countries },
  });

  return (
    <LocaleProvider locale={locale} messages={clientMessages(locale)}>
    <div lang={locale} className="mx-auto min-h-screen max-w-md px-4 py-6">
      <h1 className="text-xl font-semibold text-navy">{t("eligibility.result.title")}</h1>
      {result.total > 0 ? (
        <>
          <p className="mt-1 text-sm text-muted">
            {t("eligibility.result.summary", {
              count: result.total,
              country_count: result.countries.length,
            })}
          </p>
          <div className="mt-6">
            <EligibilityResults result={result} />
          </div>
        </>
      ) : (
        <div className="mt-6">
          <EmptyState title="No matches yet" body={t("empty.no_universities_match")} />
        </div>
      )}
    </div>
    </LocaleProvider>
  );
}
