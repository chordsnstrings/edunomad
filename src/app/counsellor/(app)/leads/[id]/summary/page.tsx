import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { SummaryComposer } from "@/components/counsellor/SummaryComposer";

export const metadata: Metadata = { title: "Call summary", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) notFound();
  if (session.role === "counsellor" && student.assignedCounsellorId !== session.userId) redirect("/counsellor");

  const lastCall = await prisma.communication.findFirst({ where: { studentId: id, type: "call" }, orderBy: { createdAt: "desc" } });
  const firstName = (student.fullName ?? "").split(" ")[0] || "there";
  const outcome = (lastCall?.metadata as { outcomeTag?: string } | null)?.outcomeTag ?? "";
  const notes = lastCall?.content?.trim();

  const prefill =
    `Hi ${firstName}, thanks for your time today.\n\n` +
    `Quick summary of our call:\n${notes || "- (add the key points we discussed)"}\n\n` +
    `Next steps:\n- (add next steps)\n\nReply here any time.`;

  return (
    <div>
      <Link href={`/counsellor/leads/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Lead
      </Link>
      <div className="mt-3 flex items-center gap-3">
        <h1 className="text-xl font-semibold text-navy">Call summary</h1>
        {outcome && <span className="rounded-full bg-navy px-2.5 py-0.5 text-xs font-semibold capitalize text-white">{outcome}</span>}
      </div>
      <p className="mt-1 text-sm text-muted">Auto-filled from your call notes. Review, edit, then send.</p>
      <div className="mt-5">
        <SummaryComposer studentId={id} initial={prefill} />
      </div>
    </div>
  );
}
