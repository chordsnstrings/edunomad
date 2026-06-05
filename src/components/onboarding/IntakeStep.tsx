"use client";

import { useState } from "react";
import { useAutosave, SaveBadge } from "./useAutosave";

const OPTIONS = [
  { id: "next_viable", title: "Next viable intake", desc: "The soonest intake I qualify for" },
  { id: "specific", title: "A specific intake", desc: "I have a target month and year" },
  { id: "undecided", title: "Undecided", desc: "Not sure yet" },
];
const MONTHS = ["January", "February", "May", "July", "September", "October"];
const YEARS = [new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2];

export function IntakeStep({ initial }: { initial?: Record<string, unknown> | null }) {
  const t = initial ?? {};
  const [choice, setChoice] = useState(String(t.choice ?? ""));
  const [month, setMonth] = useState(String(t.month ?? "September"));
  const [year, setYear] = useState(String(t.year ?? YEARS[0]));
  const { status, save } = useAutosave();

  function persist(next: Record<string, string> = {}) {
    const v = { choice, month, year, ...next };
    save({
      intakeTarget: {
        choice: v.choice,
        month: v.choice === "specific" ? v.month : null,
        year: v.choice === "specific" ? Number(v.year) : null,
      },
    });
  }

  return (
    <div className="space-y-3">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => {
            setChoice(o.id);
            persist({ choice: o.id });
          }}
          className={`flex w-full flex-col items-start rounded-xl border px-4 py-3 text-left ${
            choice === o.id ? "border-navy bg-navy/5" : "border-line hover:bg-subtle"
          }`}
        >
          <span className="text-sm font-semibold text-navy">{o.title}</span>
          <span className="text-xs text-muted">{o.desc}</span>
        </button>
      ))}

      {choice === "specific" && (
        <div className="flex gap-2 rounded-xl border border-line p-3">
          <select className="flex-1 rounded-lg border border-line px-2 py-2 outline-none focus:border-navy" value={month} onChange={(e) => { setMonth(e.target.value); persist({ month: e.target.value }); }}>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className="w-28 rounded-lg border border-line px-2 py-2 outline-none focus:border-navy" value={year} onChange={(e) => { setYear(e.target.value); persist({ year: e.target.value }); }}>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      )}
      <SaveBadge status={status} />
    </div>
  );
}
