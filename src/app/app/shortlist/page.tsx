import type { Metadata } from "next";
import { requireStudent } from "@/lib/require-student";
import { prisma } from "@/lib/db";
import { getShortlist } from "@/lib/shortlist";
import { ShortlistManager } from "@/components/app/ShortlistManager";
import { getTranslator } from "@/i18n";
import { getUserLocale } from "@/i18n/server";

export const metadata: Metadata = { title: "Shortlist", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ShortlistPage({ searchParams }: { searchParams: Promise<{ blocked?: string; locked?: string }> }) {
  const { student } = await requireStudent();
  const t = getTranslator(await getUserLocale());
  const { blocked, locked: lockedParam } = await searchParams;
  const apps = await getShortlist(student.id);

  // One query for every shortlisted programme instead of one per row.
  const programmes = await prisma.programme.findMany({
    where: { id: { in: apps.map((a) => a.programmeId) } },
    include: { institution: { select: { name: true } } },
  });
  const progBy = new Map(programmes.map((p) => [p.id, p]));

  const items = apps.map((a) => {
    const prog = progBy.get(a.programmeId);
    return {
      id: a.id,
      programmeName: prog?.name ?? "Programme",
      institutionName: prog?.institution.name ?? "",
      rationale: a.rationale ?? "",
      recommendedByCounsellor: a.recommendedByCounsellor,
      locked: a.shortlistStatus === "locked",
    };
  });
  const locked = items.some((i) => i.locked);

  const lockBlockers: { label: string; href: string }[] = [];
  if ((student.completenessPct ?? 0) < 95) lockBlockers.push({ label: `Finish your profile (${student.completenessPct ?? 0}% — need 95%)`, href: "/onboarding" });
  if (items.length < 1) lockBlockers.push({ label: "Add at least one programme", href: "/eligibility" });
  if (items.length > 6) lockBlockers.push({ label: "Remove down to 6 programmes", href: "/app/shortlist" });

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold text-navy">{t("shortlist.title")}</h1>
      <ShortlistManager
        items={items}
        locked={locked}
        completeness={student.completenessPct ?? 0}
        lockBlockers={lockBlockers}
        blocked={!!blocked}
        justLocked={!!lockedParam}
      />
    </div>
  );
}
