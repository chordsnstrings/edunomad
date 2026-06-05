import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { managedCounsellors } from "@/lib/cm-stats";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "QA review", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function QaPage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  const team = await managedCounsellors(session.userId);
  const teamIds = team.map((c) => c.userId);
  const nameByUser = new Map(team.map((c) => [c.userId, c.fullName]));

  const calls = await prisma.communication.findMany({ where: { type: "call", userId: { in: teamIds } }, orderBy: { createdAt: "desc" }, take: 80 });
  // Weighted sampling: under-reviewed counsellors weighted higher.
  const reviewCounts = new Map<string, number>();
  for (const id of teamIds) reviewCounts.set(id, await prisma.qaReview.count({ where: { counsellorUserId: id } }));
  const sampled = calls
    .map((c) => ({ c, w: (1 / (1 + (reviewCounts.get(c.userId ?? "") ?? 0))) * Math.random() }))
    .sort((a, b) => b.w - a.w)
    .slice(0, 10)
    .map((x) => x.c);

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">QA review</h1>
      <p className="mb-4 text-sm text-muted">Weighted sample of recent calls (under-reviewed counsellors prioritised).</p>
      {sampled.length === 0 ? (
        <EmptyState title="No calls to review" body="Completed calls from your team will be sampled here for QA." />
      ) : (
        <ul className="space-y-2">
          {sampled.map((c) => (
            <li key={c.id}>
              <Link href={`/counsellor/qa/${c.id}`} className="flex items-center justify-between rounded-xl border border-line bg-white p-3.5 text-sm hover:border-navy">
                <span className="font-medium text-navy">{nameByUser.get(c.userId ?? "") ?? "Counsellor"}</span>
                <span className="text-xs text-muted">{c.createdAt.toLocaleDateString()} · {(c.metadata as { outcomeTag?: string } | null)?.outcomeTag ?? "—"}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
