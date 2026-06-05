import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/current-user";
import { getSession } from "@/lib/auth";
import { SopSearch } from "@/components/admin/SopSearch";

export const metadata: Metadata = { title: "SOP search", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function SopSearchPage() {
  const ok = (await getCurrentSession()) || (await getSession());
  if (!ok) redirect("/admin/login");
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold text-navy">SOP knowledge base</h1>
      <SopSearch />
    </div>
  );
}
