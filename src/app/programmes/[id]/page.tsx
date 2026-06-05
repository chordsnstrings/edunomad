import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { estimateTotalCost } from "@/lib/cost";

export const metadata: Metadata = { title: "Programme", robots: { index: false } };
export const dynamic = "force-dynamic";

const COUNTRY: Record<string, string> = { CA: "Canada", UK: "United Kingdom", AU: "Australia", MY: "Malaysia" };
const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default async function ProgrammePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prog = await prisma.programme.findUnique({ where: { id }, include: { institution: true } });
  if (!prog) notFound();

  const cost = estimateTotalCost(prog.institution.country, prog.tuitionPerYearUsd, prog.durationMonths);
  const rows: [string, string][] = [
    ["Tuition", `${money(cost.tuitionTotal)} (${cost.years} yr${cost.years > 1 ? "s" : ""})`],
    ["Living", money(cost.livingTotal)],
    ["Visa, insurance, flights", money(cost.oneTime)],
  ];

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 py-6">
      <Link href="/eligibility" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Back to matches
      </Link>

      <div className="mt-4 rounded-2xl border border-line bg-white p-5">
        <p className="text-sm font-semibold text-navy">{prog.institution.name}</p>
        <h1 className="mt-1 text-xl font-semibold text-navy">{prog.name}</h1>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <span>{COUNTRY[prog.institution.country]}, {prog.institution.city}</span>
          <span className="capitalize">{prog.degreeLevel}</span>
          <span>{Math.round(prog.durationMonths / 12)} yr{prog.durationMonths >= 24 ? "s" : ""}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <Fact label="Tuition / year" value={money(prog.tuitionPerYearUsd)} />
          <Fact label="Min IELTS" value={(prog.englishMinSpecificIelts ?? prog.institution.englishMinIelts).toFixed(1)} />
          <Fact label="Min academic" value={`${prog.minAcademicPercentage ?? 50}%`} />
          <Fact label="Intakes" value={prog.intakeMonthsSupported.join(", ")} />
          <Fact label="Post-study work" value={`${prog.institution.postStudyWorkYears} yr`} />
          <Fact label="MOI accepted" value={prog.institution.acceptsMoiLetter ? "Yes" : "No"} />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-white p-5">
        <h2 className="text-sm font-semibold text-navy">Estimated total cost</h2>
        <dl className="mt-3 space-y-2 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-muted">{k}</dt>
              <dd className="font-medium text-ink">{v}</dd>
            </div>
          ))}
          <div className="flex justify-between border-t border-line pt-2">
            <dt className="font-semibold text-navy">Total</dt>
            <dd className="font-semibold text-navy">{money(cost.total)}</dd>
          </div>
          {cost.proofOfFunds > 0 && (
            <p className="pt-1 text-xs text-muted">
              Plus {money(cost.proofOfFunds)} proof of funds (refundable deposit / blocked account).
            </p>
          )}
        </dl>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-subtle px-3 py-2">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-medium text-navy">{value}</dd>
    </div>
  );
}
