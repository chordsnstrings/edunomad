import type { Metadata } from "next";
import { eraseStudentAction } from "./actions";

export const metadata: Metadata = { title: "DSAR", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function DsarPage({ searchParams }: { searchParams: Promise<{ erased?: string; error?: string }> }) {
  const sp = await searchParams;
  return (
    <div className="max-w-xl">
      <h1 className="mb-1 text-2xl font-semibold text-navy">Data subject requests</h1>
      <p className="mb-5 text-sm text-muted">Export or erase a student&apos;s personal data. Erasure is blocked while a visa file is in flight.</p>
      {sp.erased && <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Student data erased (PII removed; events retained).</p>}
      {sp.error === "in_flight" && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">Cannot erase — a visa file is in flight (regulatory retention).</p>}

      <div className="space-y-4 rounded-xl border border-line bg-white p-4">
        <form action="/api/dsar/export" method="get" className="flex gap-2">
          <input name="studentId" placeholder="Student ID" aria-label="Student ID" className="flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
          <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">Export data</button>
        </form>
        <form action={eraseStudentAction} className="flex gap-2">
          <input name="studentId" placeholder="Student ID" aria-label="Student ID" className="flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
          <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Erase PII</button>
        </form>
      </div>
    </div>
  );
}
