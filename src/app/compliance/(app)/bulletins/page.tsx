import type { Metadata } from "next";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { createBulletinAction, createRegUpdateAction } from "../actions";

export const metadata: Metadata = { title: "Bulletins", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function BulletinsPage() {
  await requireStaff(["compliance"], "/compliance/login");
  const bulletins = await prisma.bulletin.findMany({ orderBy: { publishedAt: "desc" }, take: 50 });
  const updates = await prisma.regulatoryUpdate.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div className="space-y-8">
      <section>
        <h1 className="mb-3 text-xl font-semibold text-navy">Regulatory bulletins</h1>
        <form action={createBulletinAction} className="space-y-2 rounded-xl border border-line bg-white p-4">
          <input name="title" placeholder="Title" aria-label="Title" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
          <textarea name="body" rows={3} placeholder="Bulletin body" aria-label="Bulletin body" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
          <input name="destination" placeholder="Destination (optional, e.g. CA)" aria-label="Destination (optional, e.g. CA)" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
          <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">Publish</button>
        </form>
        <ul className="mt-3 space-y-2">
          {bulletins.map((b) => (
            <li key={b.id} className="rounded-xl border border-line bg-white p-3.5">
              <p className="text-sm font-semibold text-navy">{b.title}{b.destination ? ` · ${b.destination}` : ""}</p>
              <p className="mt-1 text-sm text-ink">{b.body}</p>
              <p className="mt-1 text-xs text-muted">{b.publishedAt.toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-navy">Regulatory updates (checklist/forms)</h2>
        <form action={createRegUpdateAction} className="space-y-2 rounded-xl border border-line bg-white p-4">
          <input name="destination" placeholder="Destination (CA/UK/AU/MY)" aria-label="Destination (CA/UK/AU/MY)" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
          <textarea name="summary" rows={2} placeholder="What changed (form version, requirement, threshold…)" aria-label="What changed (form version, requirement, threshold…)" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
          <input aria-label="Effective Date" type="date" name="effectiveDate" className="rounded-lg border border-line px-3 py-2 text-sm" />
          <button className="rounded-lg border border-navy px-4 py-2 text-sm font-semibold text-navy hover:bg-subtle">Record update</button>
        </form>
        <ul className="mt-3 space-y-2">
          {updates.map((u) => (
            <li key={u.id} className="rounded-xl border border-line bg-white p-3.5 text-sm">
              <span className="font-semibold text-navy">{u.destination}</span> · {u.summary}
              {u.effectiveDate && <span className="text-muted"> · effective {u.effectiveDate.toLocaleDateString()}</span>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
