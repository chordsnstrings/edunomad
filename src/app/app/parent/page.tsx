import type { Metadata } from "next";
import { SubmitButton } from "@/components/ui/SubmitButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireStudent } from "@/lib/require-student";
import { prisma } from "@/lib/db";
import { inviteParentAction } from "./actions";

export const metadata: Metadata = { title: "Invite parent", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ParentInvitePage({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  const { student } = await requireStudent();
  const { sent, error } = await searchParams;
  const invites = await prisma.parentInvite.findMany({ where: { studentId: student.id }, orderBy: { sentAt: "desc" } });

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <Link href="/app" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> Home</Link>
      <h1 className="mt-3 text-xl font-semibold text-navy">Invite a parent / sponsor</h1>
      <p className="mb-4 text-sm text-muted">They&apos;ll see your progress and can approve payments. Share the PIN with them in person.</p>

      {sent && <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Invite sent.</p>}
      {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">Enter a valid phone and a 4–6 digit PIN.</p>}

      <form action={inviteParentAction} className="space-y-2 rounded-xl border border-line bg-white p-4">
        <input name="phone" type="tel" placeholder="Parent's phone (+8801…)" aria-label="Parent's phone (+8801…)" className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy" />
        <input name="pin" inputMode="numeric" placeholder="Create a PIN (4–6 digits)" aria-label="Create a PIN (4–6 digits)" className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy" />
        <SubmitButton className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700" pendingLabel="Working…">Send invite</SubmitButton>
      </form>

      {invites.length > 0 && (
        <ul className="mt-4 space-y-2">
          {invites.map((i) => (
            <li key={i.id} className="rounded-lg border border-line bg-white px-3 py-2 text-sm">
              <span className="text-ink">{i.parentPhone}</span> · <span className="text-muted">{i.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
