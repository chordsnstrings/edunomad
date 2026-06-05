import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { getOrCreateSop } from "@/lib/sop";
import { WORD_TARGETS, TONE_GUIDES } from "@/lib/sop-polish";
import { SopEditor } from "@/components/operations/SopEditor";

export const metadata: Metadata = { title: "SOP polish", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff(["operations_team", "operations_manager"]);
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) notFound();

  const sop = await getOrCreateSop(id);
  const app = await prisma.application.findFirst({ where: { studentId: id, shortlistStatus: "locked" } });
  let destination = "CA";
  if (app) {
    const prog = await prisma.programme.findUnique({ where: { id: app.programmeId }, include: { institution: true } });
    if (prog) destination = prog.institution.country;
  }
  let counsellorNote = "";
  if (student.assignedCounsellorId) {
    const n = await prisma.note.findUnique({ where: { studentId_authorUserId: { studentId: id, authorUserId: student.assignedCounsellorId } } });
    counsellorNote = n?.body ?? "";
  }

  return (
    <div>
      <Link href={`/operations/cases/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Case
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">SOP polish</h1>
      <p className="mb-5 text-sm text-muted">{student.fullName ?? student.phone}</p>
      <SopEditor
        studentId={id}
        initial={sop.content}
        status={sop.status}
        score={sop.plagiarismScore ?? null}
        destination={destination}
        target={WORD_TARGETS[destination] ?? 800}
        tone={TONE_GUIDES[destination] ?? ""}
        counsellorNote={counsellorNote}
      />
    </div>
  );
}
