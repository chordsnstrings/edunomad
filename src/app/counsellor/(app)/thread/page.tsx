import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { postThreadAction } from "../manage-actions";

export const metadata: Metadata = { title: "Team thread", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ThreadPage() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  const posts = await prisma.teamPost.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-navy">End-of-day team thread</h1>
      <form action={postThreadAction} className="mb-5 space-y-2">
        <textarea name="body" rows={3} required placeholder="What happened today? Wins, blockers, shout-outs…" aria-label="What happened today? Wins, blockers, shout-outs…" className="w-full rounded-lg border border-line px-3 py-2.5 text-sm" />
        <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">Post</button>
      </form>
      <ul className="space-y-2">
        {posts.map((p) => (
          <li key={p.id} className="rounded-xl border border-line bg-white p-3.5 text-sm">
            <p className="text-ink">{p.body}</p>
            <p className="mt-1 text-xs text-muted">{p.createdAt.toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
