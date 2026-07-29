"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type StageEvents = Record<number, { id: string; text: string; at: string }[]>;

export function JourneyTimeline({ stages, byStage, current }: { stages: string[]; byStage: StageEvents; current: number }) {
  const [open, setOpen] = useState<number | null>(current);

  return (
    <ol className="space-y-2">
      {stages.map((name, i) => {
        const stage = i + 1;
        const past = stage < current;
        const isCurrent = stage === current;
        const events = byStage[stage] ?? [];
        return (
          <li key={stage} className={`rounded-xl border ${isCurrent ? "border-navy bg-navy/5" : "border-line bg-white"}`}>
            <button
              type="button"
              onClick={() => setOpen(open === stage ? null : stage)}
              aria-expanded={open === stage}
              // Colour alone must not convey the state (CLAUDE.md §9): the
              // accessible name carries "current"/"done" as well.
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`${stages[stage - 1]} — ${past ? "done" : isCurrent ? "current stage" : "not started"}`}
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                  past ? "bg-green-600 text-white" : isCurrent ? "bg-navy text-white" : "bg-subtle text-muted"
                }`}
              >
                {past ? <Check className="h-4 w-4" /> : stage}
              </span>
              <span className={`flex-1 text-sm font-medium ${isCurrent || past ? "text-navy" : "text-muted"}`}>{name}</span>
              {events.length > 0 && <ChevronDown className={`h-4 w-4 text-muted transition ${open === stage ? "rotate-180" : ""}`} />}
            </button>
            {open === stage && events.length > 0 && (
              <ul className="space-y-2 border-t border-line/60 px-4 py-3">
                {events.map((e) => (
                  <li key={e.id} className="text-sm">
                    <p className="text-ink">{e.text}</p>
                    <p className="text-xs text-muted">{new Date(e.at).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}
