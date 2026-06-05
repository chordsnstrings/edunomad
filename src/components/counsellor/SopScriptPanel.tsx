"use client";

import { useState } from "react";
import { Search, Copy, Check, ChevronDown } from "lucide-react";
import { INTRO_SCRIPT, QUALIFICATION_QUESTIONS, OBJECTIONS } from "@/lib/reference/scripts";

export function SopScriptPanel({ firstCall = true }: { firstCall?: boolean }) {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"script" | "objections">("script");
  const [open, setOpen] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const query = q.trim().toLowerCase();
  const matches = query
    ? OBJECTIONS.filter((o) => o.headline.toLowerCase().includes(query) || o.keywords.some((k) => k.includes(query)))
    : OBJECTIONS;

  function copy(id: string, text: string) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            if (e.target.value) setTab("objections");
          }}
          placeholder="Search objections…"
          className="w-full rounded-lg border border-line py-2 pl-9 pr-3 text-sm outline-none focus:border-navy"
        />
      </div>

      <div className="mb-3 flex gap-2">
        {(["script", "objections"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize ${tab === t ? "bg-navy text-white" : "text-navy hover:bg-subtle"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "script" ? (
        <div className="space-y-3">
          {firstCall && (
            <div className="rounded-lg bg-subtle p-3">
              <p className="mb-1 text-xs font-semibold text-navy">60-second intro</p>
              <p className="text-xs leading-relaxed text-ink">{INTRO_SCRIPT}</p>
            </div>
          )}
          <div>
            <p className="mb-1.5 text-xs font-semibold text-navy">Qualification questions</p>
            <ul className="space-y-1.5">
              {QUALIFICATION_QUESTIONS.map((qn, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink">
                  <input type="checkbox" className="mt-1" />
                  <span>{qn}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {matches.map((o) => (
            <li key={o.id} className="rounded-lg border border-line">
              <button type="button" onClick={() => setOpen(open === o.id ? null : o.id)} className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-medium text-navy">
                {o.headline}
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted ${open === o.id ? "rotate-180" : ""}`} />
              </button>
              {open === o.id && (
                <div className="border-t border-line px-3 py-2">
                  <p className="text-xs leading-relaxed text-ink">{o.response}</p>
                  <button type="button" onClick={() => copy(o.id, o.response)} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-gold-600 hover:underline">
                    {copied === o.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Copy as note
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
