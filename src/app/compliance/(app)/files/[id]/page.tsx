import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, X, AlertTriangle, Stamp } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { getLatestDocuments } from "@/lib/documents";
import { crossDocConsistency } from "@/lib/consistency";
import { detectMisrepFlags } from "@/lib/misrep";
import { sendReauthCodeAction, signOffAction, returnForChangesAction, refuseToSignAction, notifyRegulatorAction } from "../../actions";

export const metadata: Metadata = { title: "Visa file", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function FileView({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ signed?: string; reauth?: string; codesent?: string; error?: string }> }) {
  const session = await requireStaff(["compliance"], "/compliance/login");
  const { id } = await params;
  const sp = await searchParams;
  const vf = await prisma.visaFile.findUnique({ where: { id } });
  if (!vf) notFound();
  const student = await prisma.student.findUnique({ where: { id: vf.studentId } });
  const docs = [...(await getLatestDocuments(vf.studentId)).values()];
  const consistency = crossDocConsistency({ fullName: student?.fullName ?? null, dateOfBirth: student?.dateOfBirth ?? null }, docs);
  const flags = detectMisrepFlags(consistency);
  const rcic = await prisma.rcicProfile.findUnique({ where: { userId: session.userId } });
  const signed = !!vf.signedOffAt;

  return (
    <div>
      <Link href="/compliance" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> Queue</Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">Visa file — {vf.destinationCountry}</h1>
      <p className="text-sm text-muted">{student?.fullName ?? student?.phone} · {vf.completenessPct}% complete</p>
      <div className="mt-1 flex gap-3">
        <Link href={`/compliance/files/${id}/audit`} className="text-sm text-navy underline">File audit log →</Link>
        <a href={`/api/visa/${id}/dossier`} target="_blank" rel="noreferrer" className="text-sm text-navy underline">Export dossier →</a>
      </div>

      {sp.signed && <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Signed off and stamped.</p>}
      {sp.reauth === "failed" && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">Re-authentication failed. Request a new code and try again.</p>}
      {sp.codesent && <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">A verification code was sent to your phone.</p>}
      {sp.error === "no_registration" && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">No RCIC/MARA registration on your profile — cannot sign off.</p>}

      <section className="mt-5">
        <h2 className="mb-2 text-sm font-semibold text-navy">Documents ({docs.length})</h2>
        <ul className="space-y-1.5">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2 text-sm">
              <span className="text-ink">{d.documentType}</span><span className="text-xs text-muted">v{d.version} · {d.status}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5">
        <h2 className="mb-2 text-sm font-semibold text-navy">Cross-document consistency</h2>
        <ul className="space-y-1.5">
          {consistency.checks.map((c) => (
            <li key={c.field} className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm">
              {c.consistent ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
              <span className="capitalize text-ink">{c.field.replace(/_/g, " ")}</span><span className="text-xs text-muted">— {c.note}</span>
            </li>
          ))}
        </ul>
      </section>

      {flags.length > 0 && (
        <section className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-700"><AlertTriangle className="h-4 w-4" /> Misrepresentation flags</h2>
          <ul className="space-y-1 text-sm text-red-700">{flags.map((f) => <li key={f.id}>[{f.severity}] {f.reason}</li>)}</ul>
        </section>
      )}

      {signed ? (
        <section className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-green-800"><Stamp className="h-4 w-4" /> Signed off</h2>
          <p className="mt-1 text-sm text-green-800">Registration {vf.registrationNumber} · hash {vf.versionHash}</p>
          <p className="text-xs text-green-700">{vf.signedOffAt?.toLocaleString()}</p>
          <details className="mt-3">
            <summary className="cursor-pointer text-sm font-semibold text-red-700">Notify regulator (misrepresentation discovered)</summary>
            <form action={notifyRegulatorAction} className="mt-2 space-y-2">
              <input type="hidden" name="fileId" value={id} />
              <input aria-label="Regulator" name="regulator" defaultValue="RCIC" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
              <input name="subject" placeholder="Subject" aria-label="Subject" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
              <textarea name="body" rows={3} placeholder="Details" aria-label="Details" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
              <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Send notification</button>
            </form>
          </details>
        </section>
      ) : (
        <div className="mt-6 space-y-4">
          <section className="rounded-xl border border-line bg-white p-4">
            <h2 className="mb-2 text-sm font-semibold text-navy">Sign off (re-auth + stamp)</h2>
            {!rcic && <p className="mb-2 text-sm text-red-600">No registration on your profile.</p>}
            <form action={sendReauthCodeAction} className="mb-2">
              <input type="hidden" name="fileId" value={id} />
              <button className="rounded-lg border border-navy px-3 py-1.5 text-sm font-semibold text-navy hover:bg-subtle">Send verification code</button>
            </form>
            <form action={signOffAction} className="flex gap-2">
              <input type="hidden" name="fileId" value={id} />
              <input name="code" inputMode="numeric" maxLength={6} placeholder="6-digit code" aria-label="6-digit code" className="w-32 rounded-lg border border-line px-3 py-2 text-sm" />
              <button disabled={!rcic} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">Sign off &amp; stamp{rcic ? ` (${rcic.registrationNumber})` : ""}</button>
            </form>
          </section>

          <section className="rounded-xl border border-line bg-white p-4">
            <h2 className="mb-2 text-sm font-semibold text-navy">Return for changes</h2>
            <form action={returnForChangesAction} className="flex gap-2">
              <input type="hidden" name="fileId" value={id} />
              <input name="reason" placeholder="What needs fixing" aria-label="What needs fixing" className="flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
              <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">Return</button>
            </form>
          </section>

          <section className="rounded-xl border border-red-200 bg-white p-4">
            <h2 className="mb-2 text-sm font-semibold text-red-700">Refuse to sign</h2>
            <p className="mb-2 text-xs text-muted">Compliance has absolute refusal authority. No business pressure overrides this.</p>
            <form action={refuseToSignAction} className="flex gap-2">
              <input type="hidden" name="fileId" value={id} />
              <input name="reason" placeholder="Reason for refusal" aria-label="Reason for refusal" className="flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
              <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Refuse</button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
