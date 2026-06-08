import type { Metadata } from "next";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/EmptyState";
import { toggleInstitutionAction } from "../actions";

export const metadata: Metadata = { title: "Partner universities", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EmPartners() {
  await requireStaff(["education_manager"], "/education/login");
  const insts = await prisma.institution.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
    take: 200,
    include: { _count: { select: { programmes: true } } },
  });

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-navy">Partner universities</h1>
      <p className="mb-4 text-sm text-muted">
        Approve a partner to make its programmes shortlistable, or pause one.
      </p>
      {insts.length === 0 ? (
        <EmptyState title="No partners yet" body="Institutions added to the catalogue will appear here for approval." />
      ) : (
        <ul className="space-y-2">
          {insts.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-navy">{i.name}</p>
                <p className="text-xs text-muted">
                  {i.country} · {i.city} · {i._count.programmes} programmes · tier {i.tier}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${i.active ? "bg-green-50 text-green-700" : "bg-subtle text-muted"}`}
                >
                  {i.active ? "Approved" : "Paused"}
                </span>
                <form action={toggleInstitutionAction}>
                  <input type="hidden" name="id" value={i.id} />
                  <input type="hidden" name="active" value={(!i.active).toString()} />
                  <button
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${i.active ? "border border-line text-navy hover:bg-subtle" : "bg-navy text-white hover:bg-navy-700"}`}
                  >
                    {i.active ? "Pause" : "Approve"}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
