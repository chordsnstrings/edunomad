import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireParent } from "@/lib/parent";
import { FaqSearch } from "@/components/app/FaqSearch";

export const metadata: Metadata = { title: "FAQ", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ParentFaq() {
  await requireParent();
  return (
    <div>
      <Link href="/parent" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <h1 className="mt-3 mb-4 text-xl font-semibold text-navy">Questions &amp; answers</h1>
      <FaqSearch />
    </div>
  );
}
