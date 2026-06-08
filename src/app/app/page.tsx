import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone, Plane } from "lucide-react";
import { requireStudent } from "@/lib/require-student";
import { prisma } from "@/lib/db";
import { requestCallAction } from "./actions";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Home", robots: { index: false } };
export const dynamic = "force-dynamic";

const LANG: Record<string, string> = { en: "English", bn: "Bangla", hi: "Hindi", ne: "Nepali" };

export default async function AppHome({ searchParams }: { searchParams: Promise<{ requested?: string }> }) {
  const { student } = await requireStudent();
  const { requested } = await searchParams;
  const counsellor = student.assignedCounsellorId
    ? await prisma.counsellorProfile.findUnique({ where: { userId: student.assignedCounsellorId } })
    : null;
  const visa = await prisma.visaFile.findFirst({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
    select: { decisionStatus: true },
  });
  const visaApproved = visa?.decisionStatus === "approved";

  const tenureYears = counsellor
    ? Math.max(1, Math.round((Date.now() - +new Date(counsellor.tenureStartedAt)) / (365 * 24 * 3600 * 1000)))
    : 0;

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 py-6">
      <h1 className="text-xl font-semibold text-navy">Your counsellor</h1>

      {requested && (
        <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Call requested — your counsellor will confirm a time shortly.
        </p>
      )}

      {counsellor ? (
        <div className="mt-4 rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-navy text-lg font-semibold text-gold-400">
              {counsellor.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </span>
            <div>
              <p className="text-base font-semibold text-navy">{counsellor.fullName}</p>
              <p className="text-sm text-muted">
                {counsellor.languages.map((l) => LANG[l] ?? l).join(", ")}
              </p>
              <p className="text-xs text-muted">{tenureYears}+ years guiding students</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              href="/app/messages"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"
            >
              <MessageCircle className="h-4 w-4" /> Send message
            </Link>
            <form action={requestCallAction}>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-navy px-4 py-2.5 text-sm font-semibold text-navy hover:bg-subtle"
              >
                <Phone className="h-4 w-4" /> Book call
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-line bg-white">
          <EmptyState
            title="Our team will be in touch shortly"
            body="We're matching you with the right counsellor. You'll get a message as soon as you're assigned."
          />
        </div>
      )}

      {visaApproved && (
        <Link
          href="/app/predeparture"
          className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-gold-300 bg-gold-50 px-4 py-3.5 hover:border-gold-600"
        >
          <div className="flex items-center gap-3">
            <Plane className="h-5 w-5 shrink-0 text-gold-600" />
            <div>
              <p className="text-sm font-semibold text-navy">Your visa is approved</p>
              <p className="text-xs text-muted">Open your pre-departure &amp; arrival checklist</p>
            </div>
          </div>
          <span aria-hidden className="text-navy">→</span>
        </Link>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link href="/app/documents" className="rounded-xl border border-line bg-white p-4 text-sm font-semibold text-navy hover:border-navy">
          Documents
        </Link>
        <Link href="/app/offers" className="rounded-xl border border-line bg-white p-4 text-sm font-semibold text-navy hover:border-navy">
          Offers
        </Link>
      </div>
      <Link href="/app/predeparture" className="mt-3 block rounded-xl border border-line bg-white p-4 text-center text-sm font-semibold text-navy hover:border-navy">
        Pre-departure &amp; arrival
      </Link>
      <Link href="/app/parent" className="mt-3 block rounded-xl border border-line bg-white p-4 text-center text-sm font-semibold text-navy hover:border-navy">
        Invite a parent / sponsor
      </Link>
    </div>
  );
}
