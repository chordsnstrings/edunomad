import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { prisma } from "@/lib/db";
import { verifyAuditChain } from "@/lib/audit";
import { verifyEventChain } from "@/lib/events";

export const metadata: Metadata = { title: "Audit log", robots: { index: false } };
export const dynamic = "force-dynamic";

/** Links verified on page load. The full chain is available on demand (?verify=full). */
const QUICK_VERIFY_WINDOW = 500;

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ page?: string; result?: string; view?: string; verify?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));
  const perPage = 50;
  const where: Record<string, unknown> = {};
  if (sp.result) where.result = sp.result;
  if (sp.view === "cross_tenant") where.reason = { contains: "cross-tenant" };

  // Both chains are append-only and retained for six years, so recomputing them
  // from genesis on every render gets slower without bound. Verify a recent
  // window by default; "?verify=full" runs the authoritative check.
  const verifyOpts = sp.verify === "full" ? {} : { limit: QUICK_VERIFY_WINDOW };
  const [rows, total, auditChain, eventChain] = await Promise.all([
    prisma.auditLog.findMany({ where, orderBy: { seq: "desc" }, skip: (page - 1) * perPage, take: perPage }),
    prisma.auditLog.count({ where }),
    verifyAuditChain(verifyOpts),
    verifyEventChain(verifyOpts),
  ]);
  const pages = Math.ceil(total / perPage);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-navy">Audit log</h1>
        <a href="/api/audit/export" className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 tap">Export CSV (with proof)</a>
      </div>
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        {[["/admin/incidents", "Incidents"], ["/admin/training-log", "Training log"], ["/admin/refusals", "Refusal analysis"], ["/admin/dsar", "DSAR"]].map(([href, label]) => (
          <Link key={href} href={href} className="rounded-lg border border-line px-3 py-1.5 text-navy hover:bg-subtle tap">{label}</Link>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {[["audit chain", auditChain.ok, auditChain.count, auditChain.full], ["event chain", eventChain.ok, eventChain.count, eventChain.full]].map(([label, ok, count, full]) => (
          <span key={String(label)} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />} {String(label)} {ok ? "intact" : "BROKEN"} ({String(count)})
            {!full && <span className="font-normal opacity-75">· last {QUICK_VERIFY_WINDOW}</span>}
          </span>
        ))}
        {auditChain.full && eventChain.full ? (
          <span className="text-xs text-muted">Full chains verified from genesis.</span>
        ) : (
          <Link href="/admin/audit?verify=full" className="rounded-lg border border-line px-3 py-1.5 text-sm text-navy hover:bg-subtle tap">
            Verify full chain
          </Link>
        )}
      </div>

      <div className="mb-3 flex gap-2 text-sm">
        <Link href="/admin/audit" className="rounded-lg border border-line px-3 py-1.5 text-navy hover:bg-subtle tap">All</Link>
        <Link href="/admin/audit?result=denied" className="rounded-lg border border-line px-3 py-1.5 text-navy hover:bg-subtle tap">Denials</Link>
        <Link href="/admin/audit?view=cross_tenant" className="rounded-lg border border-line px-3 py-1.5 text-navy hover:bg-subtle tap">Cross-tenant</Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-line text-left text-xs text-muted"><th className="p-3">Action</th><th className="p-3">Result</th><th className="p-3">Target</th><th className="p-3">When</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-line/60 last:border-0">
                <td className="p-3 text-ink">{r.action}</td>
                <td className={`p-3 font-medium ${r.result === "denied" ? "text-red-600" : r.result === "failed" ? "text-amber-700" : "text-green-700"}`}>{r.result}</td>
                <td className="p-3 text-muted">{r.targetType}{r.targetId ? ` · ${r.targetId.slice(0, 8)}` : ""}</td>
                <td className="p-3 text-muted">{r.createdAt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-3 flex gap-2 text-sm">
          {page > 1 && <Link href={`/admin/audit?page=${page - 1}`} className="rounded-lg border border-line px-3 py-1.5 tap">Previous</Link>}
          <span className="px-2 py-1.5 text-muted">Page {page} / {pages}</span>
          {page < pages && <Link href={`/admin/audit?page=${page + 1}`} className="rounded-lg border border-line px-3 py-1.5 tap">Next</Link>}
        </div>
      )}
    </div>
  );
}
