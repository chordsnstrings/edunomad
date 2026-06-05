import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, X } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { visaForms, visaCompleteness } from "@/lib/visa";
import { getLatestDocuments } from "@/lib/documents";
import { readyForSignoffAction } from "./actions";

export const metadata: Metadata = { title: "Visa file", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function VisaBuilderPage({ params }: { params: Promise<{ appId: string }> }) {
  await requireStaff(["operations_team", "operations_manager"]);
  const { appId } = await params;
  const vf = await prisma.visaFile.findUnique({ where: { applicationId: appId } });
  if (!vf) notFound();
  const student = await prisma.student.findUnique({ where: { id: vf.studentId }, select: { fullName: true, phone: true } });
  const latest = await getLatestDocuments(vf.studentId);
  const forms = visaForms(vf.destinationCountry);
  const completeness = visaCompleteness(vf.destinationCountry, latest);

  return (
    <div>
      <Link href={`/operations/cases/${vf.studentId}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Case
      </Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">Visa file — {vf.destinationCountry}</h1>
      <p className="text-sm text-muted">{student?.fullName ?? student?.phone}</p>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-sm"><span className="text-muted">Completeness</span><span className="font-semibold text-navy">{completeness}%</span></div>
        <div className="h-2 rounded-full bg-subtle"><div className="h-full rounded-full bg-gold-500" style={{ width: `${completeness}%` }} /></div>
      </div>

      <section className="mt-5">
        <h2 className="mb-2 text-sm font-semibold text-navy">Required forms (Tier B — PDF upload)</h2>
        <ul className="space-y-1.5">
          {forms.map((f) => {
            const have = latest.has(f.id);
            return (
              <li key={f.id} className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2 text-sm">
                <span className="text-ink">{f.label}{!f.required && <span className="text-xs text-muted"> · optional</span>}</span>
                {have ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-500" />}
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-5">
        {vf.readyForSignoffAt ? (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Marked ready for Compliance sign-off.</p>
        ) : (
          <form action={readyForSignoffAction}>
            <input type="hidden" name="appId" value={appId} />
            <button disabled={completeness < 100} className="rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-50">
              Mark ready for sign-off
            </button>
            {completeness < 100 && <p className="mt-1 text-xs text-muted">All required forms must be uploaded first.</p>}
          </form>
        )}
      </div>
    </div>
  );
}
