import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canEditSop, AUTHORING_GUIDE, type SopBlock } from "@/lib/sop-cms";
import { SopBlockEditor } from "@/components/admin/SopBlockEditor";
import { submitSopAction, reviewSopAction, publishSopAction, setTranslationStatusAction } from "../actions";

export const metadata: Metadata = { title: "Edit SOP", robots: { index: false } };
export const dynamic = "force-dynamic";

const LANGS = ["bn", "hi", "ne"];

export default async function SopEditorPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; published?: string; denied?: string }> }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const sp = await searchParams;
  const a = await prisma.sopArticle.findUnique({ where: { id } });
  if (!a) notFound();
  const canEdit = canEditSop(a, session);
  const versions = await prisma.sopArticleVersion.findMany({ where: { articleId: id }, orderBy: { version: "desc" }, take: 8 });
  const ts = (a.translationStatus as Record<string, string> | null) ?? {};

  return (
    <div className="max-w-3xl">
      <Link href="/admin/sop" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> SOP CMS</Link>
      {sp.saved && <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Saved as v{a.version}.</p>}
      {sp.published && <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Published v{a.publishedVersion}.</p>}
      {sp.denied && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">You don&apos;t have edit rights on this SOP.</p>}

      <div className="my-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-subtle px-2.5 py-1 text-xs font-semibold text-muted">{a.status} · v{a.version}</span>
        {a.status === "draft" && <form action={submitSopAction}><input type="hidden" name="id" value={id} /><button className="rounded-lg border border-navy px-3 py-1.5 text-sm font-semibold text-navy">Submit for review</button></form>}
        {a.status === "in_review" && (
          <>
            <form action={reviewSopAction}><input type="hidden" name="id" value={id} /><input type="hidden" name="decision" value="approve" /><button className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white">Approve</button></form>
            <form action={reviewSopAction}><input type="hidden" name="id" value={id} /><input type="hidden" name="decision" value="reject" /><button className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-ink/80">Reject</button></form>
          </>
        )}
        {a.status === "approved" && <form action={publishSopAction}><input type="hidden" name="id" value={id} /><button className="rounded-lg bg-navy px-3 py-1.5 text-sm font-semibold text-white">Publish</button></form>}
      </div>

      <SopBlockEditor id={id} title={a.title} blocks={(a.blocks as SopBlock[]) ?? []} disabled={!canEdit} />

      <section className="mt-6 rounded-xl border border-line bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-navy">Translation status</h2>
        <div className="flex flex-wrap gap-3">
          {LANGS.map((l) => (
            <form key={l} action={setTranslationStatusAction} className="flex items-center gap-1.5">
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="lang" value={l} />
              <span className="text-sm font-medium uppercase text-navy">{l}</span>
              <select name="status" defaultValue={ts[l] ?? "pending"} className="rounded-lg border border-line px-2 py-1 text-sm">
                <option value="pending">pending</option><option value="in_progress">in progress</option><option value="done">done</option>
              </select>
              <button className="rounded-lg border border-line px-2 py-1 text-xs font-semibold text-navy">Set</button>
            </form>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-line bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-navy">Version history</h2>
        <ul className="space-y-1 text-sm text-muted">
          {versions.length === 0 ? <li>No prior versions.</li> : versions.map((v) => <li key={v.id}>v{v.version} · {(v.blocks as SopBlock[]).length} blocks · {v.createdAt.toLocaleDateString()}</li>)}
        </ul>
      </section>

      <section className="mt-4 rounded-xl border border-line bg-subtle p-4">
        <h2 className="mb-2 text-sm font-semibold text-navy">Authoring guidelines</h2>
        <ul className="list-disc space-y-0.5 pl-5 text-xs text-muted">{AUTHORING_GUIDE.map((g, i) => <li key={i}>{g}</li>)}</ul>
      </section>
    </div>
  );
}
