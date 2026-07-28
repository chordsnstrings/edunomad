import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Sparkles, Plus } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { programmesById } from "@/lib/lookups";
import { getShortlist } from "@/lib/shortlist";
import { runEligibility, type StudentProfile } from "@/lib/eligibility";
import { recommendProgrammeAction, suggestRemovalAction } from "./actions";

export const metadata: Metadata = { title: "Shortlist", robots: { index: false } };
export const dynamic = "force-dynamic";

const BUCKET_COLOR: Record<string, string> = { match: "bg-green-100 text-green-700", safe: "bg-blue-100 text-blue-700", reach: "bg-amber-100 text-amber-700" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) notFound();
  if (session.role === "counsellor" && student.assignedCounsellorId !== session.userId) redirect("/counsellor");

  const profile: StudentProfile = {
    academic: student.academic as StudentProfile["academic"],
    englishProficiency: student.englishProficiency as StudentProfile["englishProficiency"],
    budgetMaxUsd: student.budgetMaxUsd,
    destinations: student.destinations as string[] | null,
    fieldCategory: student.fieldCategory,
  };
  const result = await runEligibility(profile);
  const bucketByProg: Record<string, string> = {};
  (["match", "safe", "reach"] as const).forEach((b) => result[b].forEach((c) => (bucketByProg[c.id] = b)));

  const apps = await getShortlist(id);
  const shortlistedIds = new Set(apps.map((a) => a.programmeId));
  const progs = await programmesById(apps.map((a) => a.programmeId));
  const items = apps.map((a) => {
    const prog = progs.get(a.programmeId);
    return {
      id: a.id,
      name: prog?.name ?? "Programme",
      institution: prog?.institution.name ?? "",
      bucket: bucketByProg[a.programmeId] ?? "—",
      recommendedByCounsellor: a.recommendedByCounsellor,
      rationale: a.rationale,
      locked: a.shortlistStatus === "locked",
    };
  });
  const addable = [...result.match, ...result.safe, ...result.reach].filter((c) => !shortlistedIds.has(c.id)).slice(0, 10);

  return (
    <div>
      <Link href={`/counsellor/leads/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Lead
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">Shortlist co-edit</h1>

      <section className="mt-4">
        <h2 className="mb-2 text-sm font-semibold text-navy">Student&apos;s shortlist ({items.length})</h2>
        {items.length === 0 ? (
          <p className="text-sm text-muted">Empty — recommend programmes below.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.id} className="rounded-xl border border-line bg-white p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy">{it.institution}</p>
                    <p className="truncate text-sm text-ink">{it.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${BUCKET_COLOR[it.bucket] ?? "bg-subtle text-muted"}`}>{it.bucket}</span>
                      {it.recommendedByCounsellor ? (
                        <span className="inline-flex items-center gap-1 text-xs text-gold-700"><Sparkles className="h-3 w-3" /> Recommended by you</span>
                      ) : (
                        <span className="text-xs text-muted">Student added</span>
                      )}
                    </div>
                  </div>
                  {!it.locked && !it.recommendedByCounsellor && (
                    <form action={suggestRemovalAction}>
                      <input type="hidden" name="studentId" value={id} />
                      <input type="hidden" name="applicationId" value={it.id} />
                      <button className="rounded-lg border border-line px-2.5 py-1.5 text-xs text-ink/70 hover:bg-subtle">Suggest removal</button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold text-navy">Recommend from matches</h2>
        <ul className="space-y-2">
          {addable.map((c) => (
            <li key={c.id} className="rounded-xl border border-line bg-white p-3.5">
              <p className="text-sm font-semibold text-navy">{c.institution}</p>
              <p className="text-sm text-ink">{c.name}</p>
              <form action={recommendProgrammeAction} className="mt-2 flex gap-2">
                <input type="hidden" name="studentId" value={id} />
                <input type="hidden" name="programmeId" value={c.id} />
                <input name="rationale" placeholder="Why recommend? (optional)" aria-label="Why recommend? (optional)" className="flex-1 rounded-lg border border-line px-2.5 py-1.5 text-sm outline-none focus:border-navy" />
                <button className="inline-flex items-center gap-1 rounded-lg bg-navy px-3 py-1.5 text-sm font-semibold text-white hover:bg-navy-700">
                  <Plus className="h-3.5 w-3.5" /> Recommend
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
