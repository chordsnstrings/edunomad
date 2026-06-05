import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { getCurrentSession } from "@/lib/current-user";
import { getSession } from "@/lib/auth";
import { getPublishedSopBySlug, resolveKpi, recordSopView } from "@/lib/sop-runtime";
import type { SopBlock } from "@/lib/sop-cms";

export const metadata: Metadata = { title: "SOP", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function SopView({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentSession();
  const admin = user ? null : await getSession();
  if (!user && !admin) redirect("/admin/login");
  const viewerId = user?.userId ?? admin?.sub ?? "";

  const { slug } = await params;
  const a = await getPublishedSopBySlug(slug);
  if (!a) notFound();
  await recordSopView(a.id, a.publishedVersion ?? a.version, viewerId);
  const blocks = (a.publishedBlocks as SopBlock[]) ?? [];

  const rendered = await Promise.all(
    blocks.map(async (b, i) => {
      switch (b.type) {
        case "heading": return <h2 key={i} className="mt-4 text-base font-semibold text-navy">{String(b.text)}</h2>;
        case "paragraph": return <p key={i} className="text-sm leading-relaxed text-ink">{String(b.text)}</p>;
        case "list": case "checklist":
          return <ul key={i} className="list-disc space-y-1 pl-5 text-sm text-ink">{(b.items as string[]).map((it, j) => <li key={j}>{it}</li>)}</ul>;
        case "script": return <blockquote key={i} className="rounded-lg border-l-4 border-gold-500 bg-subtle p-3 text-sm italic text-ink">{String(b.text)}</blockquote>;
        case "template": return <pre key={i} className="overflow-x-auto rounded-lg bg-subtle p-3 text-xs text-ink">{String(b.text)}</pre>;
        case "kpi": {
          const value = await resolveKpi(String(b.metric));
          return <div key={i} className="rounded-lg border border-line bg-white p-3 text-sm"><span className="font-semibold text-navy">{String(b.metric)}:</span> {value} <span className="text-muted">/ target {Number(b.target)}</span></div>;
        }
        case "compliance_warning": return <div key={i} className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertTriangle className="mt-0.5 h-4 w-4" /> {String(b.message)}</div>;
        case "decision_tree": return <div key={i} className="rounded-lg border border-line bg-white p-3 text-sm"><p className="font-semibold text-navy">{String(b.question)}</p><ul className="mt-1 list-disc pl-5 text-muted">{(b.options as { label: string; outcome: string }[]).map((o, j) => <li key={j}>{o.label} → {o.outcome}</li>)}</ul></div>;
        case "reference": return <Link key={i} href={`/sop/${String(b.articleSlug)}`} className="block text-sm font-medium text-navy underline">{String(b.label) || String(b.articleSlug)} →</Link>;
        default: return null;
      }
    }),
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link href="/sop" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> SOP search</Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">{a.title}</h1>
      <p className="mb-4 text-xs text-muted">Published v{a.publishedVersion}</p>
      <div className="space-y-3">{rendered}</div>
    </div>
  );
}
