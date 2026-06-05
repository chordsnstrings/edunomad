import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, GraduationCap } from "lucide-react";
import { getCurrentSession } from "@/lib/current-user";

export const metadata: Metadata = { title: "Welcome", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const session = await getCurrentSession();
  if (!session) redirect("/signup");

  return (
    <div className="grid min-h-screen place-items-center bg-subtle px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-7 text-center shadow-sm shadow-black/5">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold-100 text-gold-600">
          <GraduationCap className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-navy">Welcome to EduNomad</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Let&apos;s build your profile so we can match you to the right universities and
          guide you all the way to arrival.
        </p>
        <Link
          href="/onboarding"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-white hover:bg-navy-700"
        >
          Let&apos;s start <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
