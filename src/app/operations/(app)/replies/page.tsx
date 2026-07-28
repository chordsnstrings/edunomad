import type { Metadata } from "next";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { studentNames } from "@/lib/lookups";
import { EmptyState } from "@/components/ui/EmptyState";
import { classifyAction } from "./actions";

export const metadata: Metadata = { title: "Replies", robots: { index: false } };
export const dynamic = "force-dynamic";

const OPTIONS = ["acknowledged", "under_review", "info_requested", "offer_conditional", "offer_unconditional", "rejected"];

export default async function RepliesPage() {
  await requireStaff(["operations_team", "operations_manager"]);
  const emails = await prisma.inboundEmail.findMany({ where: { classified: false }, orderBy: { receivedAt: "desc" }, take: 100 });

  // Resolve email -> application -> student in two batched queries rather than
  // two queries per email.
  const appIds = emails.map((e) => e.applicationId).filter((id): id is string => !!id);
  const apps = appIds.length
    ? await prisma.application.findMany({
        where: { id: { in: [...new Set(appIds)] } },
        select: { id: true, studentId: true },
      })
    : [];
  const studentIdByApp = new Map(apps.map((a) => [a.id, a.studentId]));
  const names = await studentNames(apps.map((a) => a.studentId));

  const rows = emails.map((e) => {
    let who = e.applicationId ? "matched application" : "unmatched";
    if (e.applicationId) {
      const sid = studentIdByApp.get(e.applicationId);
      if (sid) who = names.get(sid) || "student";
    }
    return { ...e, who };
  });

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">New replies</h1>
      <p className="mb-4 text-sm text-muted">University emails matched by reference. Classify manually (v1).</p>
      {rows.length === 0 ? (
        <EmptyState title="Inbox zero" body="Inbound university replies will appear here for classification." />
      ) : (
        <ul className="space-y-3">
          {rows.map((e) => (
            <li key={e.id} className="rounded-xl border border-line bg-white p-4">
              <p className="text-sm font-semibold text-navy">{e.subject}</p>
              <p className="text-xs text-muted">From {e.fromAddress} · {e.referenceId ?? "no ref"} · {e.who}</p>
              <p className="mt-2 line-clamp-3 text-sm text-ink">{e.body}</p>
              <form action={classifyAction} className="mt-3 flex flex-wrap items-center gap-2">
                <input type="hidden" name="emailId" value={e.id} />
                <select name="classification" className="rounded-lg border border-line px-2 py-1.5 text-sm">
                  {OPTIONS.map((o) => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
                </select>
                <button className="rounded-lg bg-navy px-3 py-1.5 text-sm font-semibold text-white hover:bg-navy-700">Classify</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
