import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, X, Stamp } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { visaForms, visaCompleteness } from "@/lib/visa";
import { getLatestDocuments } from "@/lib/documents";
import { readyForSignoffAction, bookVfsAction, biometricsAction, submitVisaAction, decisionAction, passportReturnedAction } from "./actions";

export const metadata: Metadata = { title: "Visa file", robots: { index: false } };
export const dynamic = "force-dynamic";

function Row({ label, done, children }: { label: string; done: boolean; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-navy">
        {done ? <Check className="h-4 w-4 text-green-600" /> : <span className="h-4 w-4 rounded-full border border-muted" />} {label}
      </div>
      {children}
    </div>
  );
}

export default async function VisaBuilderPage({ params }: { params: Promise<{ appId: string }> }) {
  await requireStaff(["operations_team", "operations_manager"], "/operations/login");
  const { appId } = await params;
  const vf = await prisma.visaFile.findUnique({ where: { applicationId: appId } });
  if (!vf) notFound();
  const student = await prisma.student.findUnique({ where: { id: vf.studentId }, select: { fullName: true, phone: true } });
  const latest = await getLatestDocuments(vf.studentId);
  const forms = visaForms(vf.destinationCountry);
  const completeness = visaCompleteness(vf.destinationCountry, latest);
  const signed = !!vf.signedOffAt;

  return (
    <div>
      <Link href={`/operations/cases/${vf.studentId}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> Case</Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">Visa file — {vf.destinationCountry}</h1>
      <p className="text-sm text-muted">{student?.fullName ?? student?.phone}</p>

      {signed && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
          <Stamp className="h-4 w-4" /> Signed off · {vf.registrationNumber} · hash {vf.versionHash}
        </div>
      )}

      {!signed && (
        <>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-sm"><span className="text-muted">Completeness</span><span className="font-semibold text-navy">{completeness}%</span></div>
            <div className="h-2 rounded-full bg-subtle"><div className="h-full rounded-full bg-gold-500" style={{ width: `${completeness}%` }} /></div>
          </div>
          <section className="mt-5">
            <h2 className="mb-2 text-sm font-semibold text-navy">Required forms</h2>
            <ul className="space-y-1.5">
              {forms.map((f) => (
                <li key={f.id} className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2 text-sm">
                  <span className="text-ink">{f.label}{!f.required && <span className="text-xs text-muted"> · optional</span>}</span>
                  {latest.has(f.id) ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-500" />}
                </li>
              ))}
            </ul>
          </section>
          <div className="mt-5">
            {vf.returnedForChanges && <p className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Returned by Compliance: {vf.returnReason}</p>}
            {vf.readyForSignoffAt ? (
              <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">Awaiting Compliance sign-off.</p>
            ) : (
              <form action={readyForSignoffAction}>
                <input type="hidden" name="appId" value={appId} />
                <button disabled={completeness < 100} className="rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-50">Mark ready for sign-off</button>
              </form>
            )}
          </div>
        </>
      )}

      {signed && (
        <div className="mt-5 space-y-3">
          <Row label="VFS appointment" done={!!vf.vfsAppointmentAt}>
            {vf.vfsAppointmentAt ? <p className="text-sm text-muted">{vf.vfsAppointmentAt.toLocaleString()}</p> : (
              <form action={bookVfsAction} className="flex gap-2">
                <input type="hidden" name="appId" value={appId} />
                <input aria-label="Datetime" type="datetime-local" name="datetime" className="rounded-lg border border-line px-3 py-1.5 text-sm" />
                <button className="rounded-lg bg-navy px-3 py-1.5 text-sm font-semibold text-white">Book</button>
              </form>
            )}
          </Row>
          <Row label="Biometrics" done={!!vf.biometricsDoneAt}>
            {!vf.biometricsDoneAt && <form action={biometricsAction}><input type="hidden" name="appId" value={appId} /><button className="rounded-lg border border-navy px-3 py-1.5 text-sm font-semibold text-navy">Mark done</button></form>}
          </Row>
          <Row label="Submission" done={!!vf.submittedAt}>
            {!vf.submittedAt ? (
              <form action={submitVisaAction} className="flex gap-2">
                <input type="hidden" name="appId" value={appId} />
                <input name="ref" placeholder="Official reference" aria-label="Official reference" className="flex-1 rounded-lg border border-line px-3 py-1.5 text-sm" />
                <button className="rounded-lg bg-navy px-3 py-1.5 text-sm font-semibold text-white">Submit</button>
              </form>
            ) : <p className="text-sm text-muted">Submitted {vf.submittedAt.toLocaleDateString()}</p>}
          </Row>
          {vf.submittedAt && (
            <Row label="Decision" done={!!vf.decisionAt}>
              {vf.decisionStatus !== "pending" ? (
                <p className={`text-sm font-semibold ${vf.decisionStatus === "approved" ? "text-green-700" : vf.decisionStatus === "refused" ? "text-red-600" : "text-amber-700"}`}>{vf.decisionStatus}{vf.decisionStatus === "refused" && vf.refusalReasons ? ` — ${(vf.refusalReasons as string[]).join("; ")}` : ""}</p>
              ) : (
                <form action={decisionAction} className="flex flex-wrap gap-2">
                  <input type="hidden" name="appId" value={appId} />
                  <select aria-label="Decision" name="decision" className="rounded-lg border border-line px-2 py-1.5 text-sm"><option value="approved">approved</option><option value="refused">refused</option><option value="info_requested">info_requested</option></select>
                  <input name="reason" placeholder="Reason (if refused)" aria-label="Reason (if refused)" className="flex-1 rounded-lg border border-line px-3 py-1.5 text-sm" />
                  <button className="rounded-lg bg-navy px-3 py-1.5 text-sm font-semibold text-white">Record</button>
                </form>
              )}
            </Row>
          )}
          <Row label="Passport returned" done={!!vf.passportReturnedAt}>
            {!vf.passportReturnedAt && <form action={passportReturnedAction}><input type="hidden" name="appId" value={appId} /><button className="rounded-lg border border-navy px-3 py-1.5 text-sm font-semibold text-navy">Mark returned</button></form>}
          </Row>
        </div>
      )}
    </div>
  );
}
