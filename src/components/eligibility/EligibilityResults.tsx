"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { EligibilityResult } from "@/lib/eligibility";
import { EmptyState } from "@/components/ui/EmptyState";
import { useT } from "@/i18n/LocaleProvider";

type TabId = "match" | "safe" | "reach";
const TABS: TabId[] = ["match", "safe", "reach"];
const COUNTRY: Record<string, string> = { CA: "Canada", UK: "UK", AU: "Australia", MY: "Malaysia" };
const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export function EligibilityResults({ result }: { result: EligibilityResult }) {
  const t = useT();
  const [tab, setTab] = useState<TabId>("match");
  const cards = result[tab];

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {TABS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
              tab === id ? "border-navy bg-navy text-white" : "border-line text-navy hover:bg-subtle"
            }`}
          >
            {t("eligibility.tabs." + id, { count: result[id].length })}
          </button>
        ))}
      </div>

      {cards.length === 0 ? (
        <EmptyState
          title="Nothing in this bucket"
          body="Try another tab, or adjust your budget and destinations to see more options."
        />
      ) : (
        <ul className="space-y-3">
          {cards.map((c) => (
            <li key={c.id}>
              <Link
                href={`/programmes/${c.id}`}
                className="flex items-center gap-3 rounded-xl border border-line bg-white p-4 hover:border-navy"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{c.institution}</p>
                  <p className="truncate text-sm text-ink">{c.name}</p>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted">
                    <span>{COUNTRY[c.country] ?? c.country}</span>
                    <span>{money(c.tuitionPerYearUsd)}/yr</span>
                    <span>IELTS {c.englishMinIelts.toFixed(1)}</span>
                    <span>Intakes: {c.intakeMonthsSupported.join(", ")}</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-gold-600">Est. total {money(c.totalCostUsd)}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
