"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export type Lead = {
  id: string;
  name: string;
  source: string;
  leadScore: number;
  createdAt: string;
  lastActivityAt: string;
  isNew: boolean;
};

type TabId = "new" | "active" | "all";

function timeSince(iso: string) {
  const d = Date.now() - +new Date(iso);
  const h = Math.floor(d / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function CounsellorInbox({ leads }: { leads: Lead[] }) {
  const [tab, setTab] = useState<TabId>("new");
  const counts = {
    new: leads.filter((l) => l.isNew).length,
    active: leads.filter((l) => !l.isNew).length,
    all: leads.length,
  };
  const filtered = leads
    .filter((l) => (tab === "new" ? l.isNew : tab === "active" ? !l.isNew : true))
    .sort((a, b) =>
      tab === "new"
        ? +new Date(a.createdAt) - +new Date(b.createdAt) // oldest unattended first
        : +new Date(b.lastActivityAt) - +new Date(a.lastActivityAt),
    );

  const TABS: { id: TabId; label: string }[] = [
    { id: "new", label: "New" },
    { id: "active", label: "Active" },
    { id: "all", label: "All" },
  ];

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-navy">My students</h1>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold ${tab === t.id ? "border-navy bg-navy text-white" : "border-line text-navy hover:bg-subtle"}`}
          >
            {t.label}
            <span className={`ml-1.5 text-xs ${tab === t.id ? "text-white/80" : "text-muted"}`}>{counts[t.id]}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Nothing here yet" body="New leads routed to you will appear in this tab." />
      ) : (
        <ul className="space-y-2">
          {filtered.map((l) => (
            <li key={l.id}>
              <Link href={`/counsellor/leads/${l.id}`} className="flex items-center gap-3 rounded-xl border border-line bg-white p-4 hover:border-navy">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy/5 text-sm font-semibold text-navy">
                  {l.leadScore}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{l.name}</p>
                  <p className="text-xs text-muted">{l.source} · {timeSince(l.createdAt)}</p>
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
