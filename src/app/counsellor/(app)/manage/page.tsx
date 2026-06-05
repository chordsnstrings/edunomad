import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/require-staff";

export const metadata: Metadata = { title: "Manage", robots: { index: false } };
export const dynamic = "force-dynamic";

const LINKS: [string, string][] = [
  ["/counsellor/reassign", "Reassign leads"],
  ["/counsellor/pips", "Improvement plans"],
  ["/counsellor/one-on-one", "1:1 meetings"],
  ["/counsellor/hiring", "Hiring pipeline"],
  ["/counsellor/training", "Training sessions"],
  ["/counsellor/leave", "Leave & capacity"],
  ["/counsellor/exits", "Exit interviews"],
  ["/counsellor/thread", "Team thread"],
  ["/counsellor/review", "Monthly business review"],
];

export default async function ManageHub() {
  const session = await requireStaff(["counsellor", "counsellor_manager"]);
  if (session.role !== "counsellor_manager") redirect("/counsellor");
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-navy">Manage team</h1>
      <div className="grid grid-cols-2 gap-3">
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href} className="rounded-xl border border-line bg-white p-4 text-sm font-semibold text-navy hover:border-navy">{label}</Link>
        ))}
      </div>
    </div>
  );
}
