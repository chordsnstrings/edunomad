import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { QA_CALL_RUBRIC } from "@/lib/reference/qa-call-rubric";
import { saveQaReviewAction } from "./actions";

export const metadata: Metadata = { title: "QA review", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function QaReviewPage({ params }: { params: Promise<{ commId: string }> }) {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  const { commId } = await params;
  const comm = await prisma.communication.findUnique({ where: { id: commId } });
  if (!comm) notFound();

  return (
    <div>
      <Link href="/counsellor/qa" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> QA</Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">Call review (20 points)</h1>
      {comm.transcript && <div className="mt-3 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg border border-line bg-subtle p-3 text-xs text-ink">{comm.transcript}</div>}
      <form action={saveQaReviewAction} className="mt-4 space-y-1.5">
        <input type="hidden" name="commId" value={commId} />
        {QA_CALL_RUBRIC.map((item, i) => (
          <label key={i} className="flex items-start gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm">
            <input type="checkbox" name={`q${i}`} className="mt-0.5" />
            <span className="text-ink">{item}</span>
          </label>
        ))}
        <textarea name="notes" rows={2} placeholder="Notes / coaching points" className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm" />
        <button className="mt-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">Save review</button>
      </form>
    </div>
  );
}
