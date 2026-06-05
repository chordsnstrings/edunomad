import type { Metadata } from "next";
import { requireStudent } from "@/lib/require-student";
import { prisma } from "@/lib/db";
import { renderEventTemplate } from "@/lib/event-templates";
import { JourneyTimeline } from "@/components/app/JourneyTimeline";
import type { Locale } from "@/i18n/config";

export const metadata: Metadata = { title: "Journey", robots: { index: false } };
export const dynamic = "force-dynamic";

const STAGES = [
  "Profile & Eligibility",
  "Counsellor Onboarding",
  "Shortlist",
  "Application Prep",
  "Application Submitted",
  "University Decision",
  "Tuition & GIC",
  "Visa",
  "Pre-Departure & Arrival",
];

export default async function JourneyPage() {
  const { student } = await requireStudent();
  const events = await prisma.event.findMany({ where: { studentId: student.id }, orderBy: { seq: "asc" } });

  const byStage: Record<number, { id: string; text: string; at: string }[]> = {};
  for (const e of events) {
    (byStage[e.stage] ||= []).push({
      id: e.id,
      text: renderEventTemplate({ type: e.type, payload: e.payload as Record<string, unknown> | null }, student.language as Locale),
      at: e.createdAt.toISOString(),
    });
  }
  const current = events.length ? Math.max(...events.map((e) => e.stage)) : 1;

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold text-navy">Your journey</h1>
      <JourneyTimeline stages={STAGES} byStage={byStage} current={current} />
    </div>
  );
}
