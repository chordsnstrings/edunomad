import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Globe, Cpu } from "lucide-react";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { getLatestDocuments } from "@/lib/documents";
import { decryptSecret } from "@/lib/crypto-vault";
import { renderEventTemplate } from "@/lib/event-templates";
import { packageAction, storeCredentialAction, submitAction, saveOfferAction } from "./actions";

export const metadata: Metadata = { title: "Submit application", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Page({ params, searchParams }: { params: Promise<{ id: string; appId: string }>; searchParams: Promise<{ submitted?: string; noproof?: string }> }) {
  await requireStaff(["operations_team", "operations_manager"], "/operations/login");
  const { id, appId } = await params;
  const { submitted, noproof } = await searchParams;
  const app = await prisma.application.findUnique({ where: { id: appId } });
  if (!app || app.studentId !== id) notFound();
  const programme = await prisma.programme.findUnique({ where: { id: app.programmeId }, include: { institution: true } });
  if (!programme) notFound();
  const inst = programme.institution;

  const latest = [...(await getLatestDocuments(id)).values()];
  const packaged = new Set((await prisma.applicationDocument.findMany({ where: { applicationId: appId }, select: { documentId: true } })).map((d) => d.documentId));
  const cred = inst.submissionTier === 2 ? await prisma.institutionCredential.findUnique({ where: { institutionId: inst.id } }) : null;
  const refId = app.referenceId ?? `EN-${appId.slice(0, 8).toUpperCase()}`;
  const isSubmitted = app.submissionStatus === "submitted";
  const timeline = await prisma.event.findMany({ where: { applicationId: appId }, orderBy: { seq: "desc" }, take: 30 });

  return (
    <div>
      <Link href={`/operations/cases/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> Case</Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">{inst.name}</h1>
      <p className="text-sm text-muted">{programme.name} · {inst.country} · Tier {inst.submissionTier}</p>
      {app.decisionStatus === "accepted" && (
        <Link href={`/operations/visa/${appId}`} className="mt-2 inline-block rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
          Open visa file →
        </Link>
      )}

      {submitted && <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Submitted. Reference {refId}.</p>}
      {noproof && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">Submission proof is required.</p>}
      {isSubmitted && !submitted && <p className="mt-3 rounded-lg bg-subtle px-3 py-2 text-sm text-muted">Already submitted ({app.submissionMethod}) · ref {app.referenceId}</p>}

      {/* Packaging */}
      <section className="mt-5">
        <h2 className="mb-2 text-sm font-semibold text-navy">Package documents</h2>
        <form action={packageAction} className="space-y-2">
          <input type="hidden" name="appId" value={appId} />
          <input type="hidden" name="caseId" value={id} />
          {latest.length === 0 ? <p className="text-sm text-muted">No documents uploaded yet.</p> : latest.map((d) => (
            <label key={d.id} className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm">
              <input type="checkbox" name="docIds" value={d.id} defaultChecked={packaged.has(d.id)} />
              <span className="flex-1 text-ink">{d.documentType}</span>
              <span className="text-xs text-muted">{d.status}</span>
            </label>
          ))}
          <button className="rounded-lg border border-navy px-4 py-2 text-sm font-semibold text-navy hover:bg-subtle">Save package</button>
        </form>
      </section>

      {/* Submission by tier */}
      {!isSubmitted && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-navy">Submit</h2>
          {inst.submissionTier === 1 && (
            <div className="rounded-xl border border-line bg-white p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-navy"><Mail className="h-4 w-4" /> Tier 1 — email gateway</p>
              <div className="mt-2 rounded-lg bg-subtle p-3 text-xs text-ink">
                <p>To: {inst.admissionsEmail ?? "admissions@…"}</p>
                <p>Subject: Application — {programme.name} — {refId}</p>
                <p className="mt-1 text-muted">Reference {refId} is embedded for reply matching.</p>
              </div>
              <form action={submitAction} className="mt-3">
                <input type="hidden" name="appId" value={appId} /><input type="hidden" name="caseId" value={id} /><input type="hidden" name="method" value="email" />
                <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">Send &amp; mark submitted</button>
              </form>
            </div>
          )}
          {inst.submissionTier === 2 && (
            <div className="rounded-xl border border-line bg-white p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-navy"><Globe className="h-4 w-4" /> Tier 2 — portal (open &amp; submit)</p>
              {cred ? (
                <div className="mt-2 space-y-1 rounded-lg bg-subtle p-3 text-xs text-ink [overflow-wrap:anywhere]">
                  <p>Portal: <a href={cred.portalUrl} target="_blank" rel="noreferrer" className="text-navy underline">{cred.portalUrl}</a></p>
                  <p>User: {cred.username}</p>
                  <p>Pass: <span className="font-mono">{decryptSecret(cred.passwordEnc)}</span></p>
                </div>
              ) : (
                <form action={storeCredentialAction} className="mt-2 space-y-2">
                  <input type="hidden" name="institutionId" value={inst.id} /><input type="hidden" name="appId" value={appId} /><input type="hidden" name="caseId" value={id} />
                  <input name="portalUrl" placeholder="Portal URL" aria-label="Portal URL" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
                  <input name="username" placeholder="Username" aria-label="Username" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
                  <input name="password" placeholder="Password" aria-label="Password" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
                  <button className="rounded-lg border border-navy px-3 py-1.5 text-sm font-semibold text-navy">Store credentials (encrypted)</button>
                </form>
              )}
              <form action={submitAction} className="mt-3 flex gap-2">
                <input type="hidden" name="appId" value={appId} /><input type="hidden" name="caseId" value={id} /><input type="hidden" name="method" value="portal" />
                <input name="proof" placeholder="Proof (portal reference / screenshot id)" aria-label="Proof (portal reference / screenshot id)" className="flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
                <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">Mark submitted</button>
              </form>
            </div>
          )}
          {inst.submissionTier === 3 && (
            <div className="rounded-xl border border-line bg-white p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-navy"><Cpu className="h-4 w-4" /> Tier 3 — API (stubbed)</p>
              <form action={submitAction} className="mt-3">
                <input type="hidden" name="appId" value={appId} /><input type="hidden" name="caseId" value={id} /><input type="hidden" name="method" value="api" />
                <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">Submit via API</button>
              </form>
            </div>
          )}
        </section>
      )}

      {app.decisionStatus?.startsWith("offer") && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-navy">Offer — letter &amp; conditions</h2>
          <form action={saveOfferAction} className="space-y-2 rounded-xl border border-line bg-white p-4">
            <input type="hidden" name="appId" value={appId} /><input type="hidden" name="caseId" value={id} />
            <input name="offerUrl" defaultValue={app.offerUrl ?? ""} placeholder="Offer letter URL" aria-label="Offer letter URL" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
            <textarea name="conditions" defaultValue={((app.conditions as string[] | null) ?? []).join("\n")} rows={4} placeholder="One condition per line (for conditional offers)" aria-label="One condition per line (for conditional offers)" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
            <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">Save offer details</button>
          </form>
        </section>
      )}

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold text-navy">Application timeline</h2>
        {timeline.length === 0 ? (
          <p className="text-sm text-muted">No events yet.</p>
        ) : (
          <ul className="space-y-2.5">
            {timeline.map((e) => (
              <li key={e.id} className="flex gap-3 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                <div>
                  <p className="text-ink">{renderEventTemplate({ type: e.type, payload: e.payload as Record<string, unknown> | null }, "en")}</p>
                  <p className="text-xs text-muted">{e.createdAt.toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
