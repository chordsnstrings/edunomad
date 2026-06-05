import type { Metadata } from "next";
import { requireStudent } from "@/lib/require-student";
import { runEligibility, type StudentProfile } from "@/lib/eligibility";
import { emit } from "@/lib/events";
import { EligibilityResults } from "@/components/eligibility/EligibilityResults";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Your matches", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EligibilityPage() {
  const { student, session } = await requireStudent();
  const profile: StudentProfile = {
    academic: student.academic as StudentProfile["academic"],
    englishProficiency: student.englishProficiency as StudentProfile["englishProficiency"],
    budgetMaxUsd: student.budgetMaxUsd,
    destinations: student.destinations as string[] | null,
    fieldCategory: student.fieldCategory,
  };
  const result = await runEligibility(profile);
  await emit({
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
    <div className="mx-auto min-h-screen max-w-md px-4 py-6">
      <h1 className="text-xl font-semibold text-navy">Your matches</h1>
      {result.total > 0 ? (
        <>
          <p className="mt-1 text-sm text-muted">
            {result.total} programmes across {result.countries.length}{" "}
            {result.countries.length === 1 ? "country" : "countries"}.
          </p>
          <div className="mt-6">
            <EligibilityResults result={result} />
          </div>
        </>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="No matches yet"
            body="Widen your budget or destinations, or finish your profile — then we'll find programmes that fit."
          />
        </div>
      )}
    </div>
  );
}
