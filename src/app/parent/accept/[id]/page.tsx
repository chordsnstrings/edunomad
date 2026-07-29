import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { isInviteExpired } from "@/lib/parent";
import { sendParentCodeAction, acceptInviteAction } from "./actions";

export const metadata: Metadata = { title: "Accept invite", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AcceptPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ codesent?: string; pin?: string; code?: string; expired?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const invite = await prisma.parentInvite.findUnique({ where: { id } });

  return (
    <div className="grid min-h-screen place-items-center bg-subtle px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-6">
        <h1 className="text-lg font-semibold text-navy">Follow your child&apos;s journey</h1>
        {!invite ? (
          <p className="mt-2 text-sm text-red-600">This invite link is invalid.</p>
        ) : invite.status === "expired" || sp.expired || isInviteExpired(invite) ? (
          <p className="mt-2 text-sm text-muted">
            This invite has expired. Ask your child to send a new one from their EduNomad app —
            nothing on their file has changed.
          </p>
        ) : invite.status !== "sent" ? (
          <p className="mt-2 text-sm text-muted">This invite was already accepted. <a href="/parent/login" className="text-navy underline">Sign in</a>.</p>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted">Enter the PIN your child shared, then verify your number.</p>
            {sp.codesent && <p className="mt-2 rounded bg-blue-50 px-3 py-1.5 text-sm text-blue-700">Code sent to your phone.</p>}
            {sp.pin === "bad" && <p className="mt-2 rounded bg-red-50 px-3 py-1.5 text-sm text-red-700">Incorrect PIN.</p>}
            {sp.code === "bad" && <p className="mt-2 rounded bg-red-50 px-3 py-1.5 text-sm text-red-700">Invalid code.</p>}

            <form action={sendParentCodeAction} className="mt-3">
              <input type="hidden" name="id" value={id} />
              <button className="w-full rounded-lg border border-navy px-4 py-2 text-sm font-semibold text-navy hover:bg-subtle">Send verification code</button>
            </form>
            <form action={acceptInviteAction} className="mt-3 space-y-2">
              <input type="hidden" name="id" value={id} />
              <input name="pin" inputMode="numeric" placeholder="PIN" aria-label="PIN" className="w-full rounded-lg border border-line px-3 py-2.5 text-sm" />
              <input name="code" inputMode="numeric" maxLength={6} placeholder="6-digit code" aria-label="6-digit code" className="w-full rounded-lg border border-line px-3 py-2.5 text-sm" />
              <button className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">Accept &amp; continue</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
