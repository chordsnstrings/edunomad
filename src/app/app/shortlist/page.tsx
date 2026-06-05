import type { Metadata } from "next";
import { requireStudent } from "@/lib/require-student";
import { prisma } from "@/lib/db";
import { getShortlist } from "@/lib/shortlist";
import { ShortlistManager } from "@/components/app/ShortlistManager";

export const metadata: Metadata = { title: "Shortlist", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ShortlistPage({ searchParams }: { searchParams: Promise<{ blocked?: string; locked?: string }> }) {
  const { student } = await requireStudent();
  const { blocked, locked: lockedParam } = await searchParams;
  const apps = await getShortlist(student.id);

  const items = await Promise.all(
    apps.map(async (a) => {
      const prog = await prisma.programme.findUnique({ where: { id: a.programmeId }, include: { institution: true } });
      return {
        id: a.id,
        programmeName: prog?.name ?? "Programme",
        institutionName: prog?.institution.name ?? "",
        rationale: a.rationale ?? "",
        recommendedByCounsellor: a.recommendedByCounsellor,
        locked: a.shortlistStatus === "locked",
      };
    }),
  );
  const locked = items.some((i) => i.locked);

  const lockBlockers: { label: string; href: string }[] = [];
  if ((student.completenessPct ?? 0) < 95) lockBlockers.push({ label: `Finish your profile (${student.completenessPct ?? 0}% — need 95%)`, href: "/onboarding" });
  if (items.length < 1) lockBlockers.push({ label: "Add at least one programme", href: "/eligibility" });
  if (items.length > 6) lockBlockers.push({ label: "Remove down to 6 programmes", href: "/app/shortlist" });

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold text-navy">Your shortlist</h1>
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
