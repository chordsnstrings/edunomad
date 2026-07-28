"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { PARENT_FAQ } from "@/lib/reference/parent-faq";

export function FaqSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const ql = q.trim().toLowerCase();
  const items = ql ? PARENT_FAQ.filter((f) => f.q.toLowerCase().includes(ql) || f.a.toLowerCase().includes(ql)) : PARENT_FAQ;

  return (
    <div>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions…" aria-label="Search questions…" className="w-full rounded-lg border border-line py-2.5 pl-9 pr-3 text-sm outline-none focus:border-navy" />
      </div>
      <ul className="space-y-2">
        {items.map((f, i) => (
          <li key={i} className="rounded-xl border border-line bg-white">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-navy">
              {f.q}
              <ChevronDown className={`h-4 w-4 shrink-0 text-muted ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="border-t border-line px-3.5 py-3 text-sm leading-relaxed text-ink">{f.a}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
