import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, AlertTriangle } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { getChecklistForStudent, getLatestDocuments } from "@/lib/documents";

export const metadata: Metadata = { title: "Case", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff(["operations_team", "operations_manager"]);
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) notFound();

  const apps = await prisma.application.findMany({ where: { studentId: id, shortlistStatus: "locked" } });
  const progs = await prisma.programme.findMany({ where: { id: { in: apps.map((a) => a.programmeId) } }, include: { institution: true } });
  const checklist = await getChecklistForStudent(student);
  const latest = await getLatestDocuments(id);
  const requiredMissing = checklist.filter((d) => d.required && !latest.has(d.documentType));

  return (
    <div>
      <Link href="/operations" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Queue
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">{student.fullName ?? student.phone}</h1>
      <p className="text-sm text-muted">{student.sourceCountry} · {student.fieldOfStudy ?? "—"}</p>

      <div className={`mt-4 flex items-center gap-2 rounded-xl border p-3 text-sm ${requiredMissing.length === 0 ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
        {requiredMissing.length === 0 ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
        {requiredMissing.length === 0 ? "All required documents present — ready to package." : `${requiredMissing.length} required document(s) missing.`}
      </div>

      <section className="mt-5">
        <h2 className="mb-2 text-sm font-semibold text-navy">Locked programmes ({progs.length})</h2>
        <ul className="space-y-2">
          {progs.map((p) => (
            <li key={p.id} className="rounded-xl border border-line bg-white p-3.5">
              <p className="text-sm font-semibold text-navy">{p.institution.name}</p>
              <p className="text-sm text-ink">{p.name}</p>
              <p className="text-xs text-muted">{p.institution.country} · submission tier {p.institution.submissionTier}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5">
        <h2 className="mb-2 text-sm font-semibold text-navy">Document audit</h2>
        <ul className="space-y-1.5">
          {checklist.filter((d) => d.required).map((d) => {
            const doc = latest.get(d.documentType);
            return (
              <li key={d.documentType} className="rounded-lg border border-line bg-white text-sm">
                {doc ? (
                  <Link href={`/operations/cases/${id}/docs/${doc.id}`} className="flex items-center justify-between px-3 py-2 hover:bg-subtle">
                    <span className="text-ink">{d.label}</span>
                    <span className="text-navy underline">{doc.status} · review</span>
                  </Link>
                ) : (
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-ink">{d.label}</span>
                    <span className="text-red-600">missing</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
