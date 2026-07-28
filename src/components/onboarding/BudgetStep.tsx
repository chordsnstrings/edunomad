"use client";

import { useState } from "react";
import { useAutosave, SaveBadge } from "./useAutosave";

const field = "w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-navy";

export function BudgetStep({
  initial,
}: {
  initial?: { min?: number | null; max?: number | null; funding?: string | null };
}) {
  const [min, setMin] = useState(initial?.min == null ? "" : String(initial.min));
  const [max, setMax] = useState(initial?.max == null ? "" : String(initial.max));
  const [funding, setFunding] = useState(initial?.funding ?? "");
  const { status, save } = useAutosave();

  function persist() {
    save({
      budgetMinUsd: min === "" ? null : Number(min),
      budgetMaxUsd: max === "" ? null : Number(max),
      fundingSource: funding,
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Min / year (USD)</label>
          <input className={field} inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value)} onBlur={persist} placeholder="10000" aria-label="10000" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Max / year (USD)</label>
          <input className={field} inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value)} onBlur={persist} placeholder="25000" aria-label="25000" />
        </div>
      </div>
      <p className="rounded-lg bg-subtle p-3 text-xs leading-relaxed text-muted">
        Be honest about your real budget — tuition plus living costs. An accurate range gets
        you matches you can actually fund, and a stronger visa file.
      </p>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy">Funding source</label>
        <textarea
          className={field}
          rows={3}
          value={funding}
          onChange={(e) => setFunding(e.target.value)}
          onBlur={persist}
          placeholder="e.g. family savings, education loan, sponsor" aria-label="e.g. family savings, education loan, sponsor"
        />
      </div>
      <SaveBadge status={status} />
    </div>
  );
}
