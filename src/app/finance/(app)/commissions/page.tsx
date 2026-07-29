import type { Metadata } from "next";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { requireStaff } from "@/lib/require-staff";
import { prisma } from "@/lib/db";
import { fmtMoney } from "@/lib/currency";
import { EmptyState } from "@/components/ui/EmptyState";
import { generateCommissionsAction, setCommissionStatusAction } from "../actions";

export const metadata: Metadata = { title: "Commissions", robots: { index: false } };
export const dynamic = "force-dynamic";

const NEXT: Record<string, { to: string; label: string } | undefined> = {
  expected: { to: "invoiced", label: "Mark invoiced" },
  invoiced: { to: "received", label: "Mark received" },
};
const BADGE: Record<string, string> = {
  expected: "bg-amber-50 text-amber-700",
  invoiced: "bg-blue-50 text-blue-700",
  received: "bg-green-50 text-green-700",
  reconciled: "bg-subtle text-muted",
  written_off: "bg-red-50 text-red-700",
};

export default async function CommissionsPage() {
  await requireStaff(["finance"], "/finance/login");
  const commissions = await prisma.commission.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  const instIds = [...new Set(commissions.map((c) => c.institutionId))];
  const insts = await prisma.institution.findMany({
    where: { id: { in: instIds } },
    select: { id: true, name: true },
  });
  const instName = (id: string) => insts.find((i) => i.id === id)?.name ?? "Institution";

  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-navy">Commissions</h1>
          <p className="text-sm text-muted">University commission earned per application.</p>
        </div>
        <form action={generateCommissionsAction}>
          <SubmitButton className="shrink-0 rounded-lg border border-navy px-3 py-2 text-sm font-semibold text-navy hover:bg-subtle" pendingLabel="Working…">
            Accrue expected
          </SubmitButton>
        </form>
      </div>
      {commissions.length === 0 ? (
        <EmptyState
          title="No commissions yet"
          body="Use “Accrue expected” to generate commissions for applications that have an offer."
        />
      ) : (
        <ul className="space-y-2">
          {commissions.map((c) => {
            const next = NEXT[c.status];
            return (
              <li key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy">{instName(c.institutionId)}</p>
                  <p className="text-xs text-muted">
                    {c.ratePct}% · {fmtMoney(c.amount, c.currency)} ≈ {fmtMoney(c.amountUsd)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${BADGE[c.status] ?? "bg-subtle text-muted"}`}>
                    {c.status.replace(/_/g, " ")}
                  </span>
                  {next && (
                    <form action={setCommissionStatusAction}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="status" value={next.to} />
                      <SubmitButton className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-700" pendingLabel="Working…">
                        {next.label}
                      </SubmitButton>
                    </form>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
