import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { KeyRound, ShieldCheck } from "lucide-react";
import { getCurrentSession } from "@/lib/current-user";
import { prisma } from "@/lib/db";
import { otpauthUri } from "@/lib/totp";
import { staffTwoFactorEnabled, twoFactorAvailable, twoFactorMandatory } from "@/lib/staff-2fa";
import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  beginEnrollmentAction,
  confirmEnrollmentAction,
  verifyChallengeAction,
} from "./actions";

export const metadata: Metadata = { title: "Two-factor authentication", robots: { index: false } };
export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  invalid: "That code didn't match. Check your authenticator app and try again.",
  rate_limited: "Too many attempts. Wait 15 minutes and try again.",
};

export default async function StaffTwoFactorPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; setup?: string; error?: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/counsellor/login");
  if (!twoFactorAvailable(session.role)) redirect("/");

  const { next = "/", setup, error } = await searchParams;
  // Only relative paths: `next` comes from a query string, and redirecting to
  // whatever it contains would turn this page into an open redirect off the back
  // of a valid session.
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  const enabled = await staffTwoFactorEnabled(session.userId);
  const mandatory = twoFactorMandatory(session.role);
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { phone: true, email: true },
  });
  const label = user?.email ?? user?.phone ?? session.userId;

  return (
    <div className="grid min-h-screen place-items-center bg-subtle px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-6">
        <div className="mb-5 flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-navy text-gold-400">
            {enabled ? <ShieldCheck className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}
          </span>
          <h1 className="mt-3 text-lg font-semibold text-navy">
            {enabled ? "Two-factor check" : "Set up two-factor"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {enabled
              ? "Enter the 6-digit code from your authenticator app, or a recovery code."
              : mandatory
                ? "Your role signs off on legal documents, so a second factor is required before you can continue."
                : "Add a second factor to your account."}
          </p>
        </div>

        {error && (
          <p role="alert" className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {ERRORS[error] ?? "Something went wrong. Try again."}
          </p>
        )}

        {enabled ? (
          <form action={verifyChallengeAction} className="space-y-3">
            <input type="hidden" name="next" value={safeNext} />
            <input
              name="code"
              inputMode="text"
              autoComplete="one-time-code"
              autoFocus
              placeholder="123456"
              aria-label="Authentication code"
              className="w-full rounded-lg border border-line px-3 py-2.5 text-center tracking-widest outline-none focus:border-navy"
            />
            <SubmitButton
              pendingLabel="Checking…"
              className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"
            >
              Verify
            </SubmitButton>
          </form>
        ) : setup ? (
          <form action={confirmEnrollmentAction} className="space-y-3">
            <input type="hidden" name="next" value={safeNext} />
            <p className="text-sm text-ink">Add this account to your authenticator app:</p>
            <code className="block break-all rounded-lg bg-subtle px-3 py-2 text-xs text-navy">
              {otpauthUri(setup, label)}
            </code>
            <p className="text-xs text-muted">
              Or enter the key manually: <span className="font-mono text-navy">{setup}</span>
            </p>
            <input
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              aria-label="Six-digit code from your app"
              className="w-full rounded-lg border border-line px-3 py-2.5 text-center tracking-widest outline-none focus:border-navy"
            />
            <SubmitButton
              pendingLabel="Confirming…"
              className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"
            >
              Confirm and continue
            </SubmitButton>
          </form>
        ) : (
          <form action={beginEnrollmentAction} className="space-y-3">
            <input type="hidden" name="next" value={safeNext} />
            <SubmitButton
              pendingLabel="Preparing…"
              className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"
            >
              Start setup
            </SubmitButton>
          </form>
        )}
      </div>
    </div>
  );
}
