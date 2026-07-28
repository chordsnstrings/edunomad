import type { Metadata } from "next";
import Link from "next/link";
import { requireStudent } from "@/lib/require-student";
import { prisma } from "@/lib/db";
import { renderEventTemplate } from "@/lib/event-templates";
import { JourneyTimeline } from "@/components/app/JourneyTimeline";
import { getTranslator } from "@/i18n";
import { getUserLocale } from "@/i18n/server";

export const metadata: Metadata = { title: "Journey", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function JourneyPage() {
  const { student } = await requireStudent();
  const locale = await getUserLocale();
  const t = getTranslator(locale);
  const STAGES = Array.from({ length: 9 }, (_, i) => t(`tracker.stage_${i + 1}`));
  const events = await prisma.event.findMany({ where: { studentId: student.id }, orderBy: { seq: "asc" } });

  const byStage: Record<number, { id: string; text: string; at: string }[]> = {};
  for (const e of events) {
    (byStage[e.stage] ||= []).push({
      id: e.id,
      text: renderEventTemplate({ type: e.type, payload: e.payload as Record<string, unknown> | null }, locale),
      at: e.createdAt.toISOString(),
    });
  }
  const current = events.length ? Math.max(...events.map((e) => e.stage)) : 1;

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold text-navy">{t("tracker.title")}</h1>
      <JourneyTimeline stages={STAGES} byStage={byStage} current={current} />
      <Link
        href="/app/predeparture"
        className="mt-4 block rounded-xl border border-line bg-white px-4 py-3 text-center text-sm font-semibold text-navy hover:border-navy"
      >
        Pre-departure &amp; arrival checklist →
      </Link>
    </div>
  );
}
