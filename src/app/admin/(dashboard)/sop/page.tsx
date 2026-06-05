import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { createSopAction } from "./actions";

export const metadata: Metadata = { title: "SOP CMS", robots: { index: false } };
export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = { draft: "bg-subtle text-muted", in_review: "bg-amber-100 text-amber-700", approved: "bg-blue-100 text-blue-700", published: "bg-green-100 text-green-700" };

export default async function SopListPage() {
  const sops = await prisma.sopArticle.findMany({ orderBy: { updatedAt: "desc" }, take: 200 });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-navy">SOP CMS</h1>
      <p className="mb-5 text-sm text-muted">Author, version, review and publish standard operating procedures.</p>

      <form action={createSopAction} className="mb-6 flex flex-wrap gap-2 rounded-xl border border-line bg-white p-4">
        <input name="title" placeholder="New SOP title" className="flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
        <input name="category" placeholder="Category (optional)" className="rounded-lg border border-line px-3 py-2 text-sm" />
        <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">Create</button>
      </form>

      <ul className="space-y-2">
        {sops.map((s) => (
          <li key={s.id}>
            <Link href={`/admin/sop/${s.id}`} className="flex items-center justify-between rounded-xl border border-line bg-white p-4 hover:border-navy">
              <div>
                <p className="text-sm font-semibold text-navy">{s.title}</p>
                <p className="text-xs text-muted">{s.category ?? "Uncategorised"} · v{s.version}{s.publishedVersion ? ` · published v${s.publishedVersion}` : ""}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS[s.status] ?? "bg-subtle text-muted"}`}>{s.status}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
