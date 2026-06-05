"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, GripVertical, X } from "lucide-react";
import { useAutosave, SaveBadge } from "./useAutosave";

const DESTS: Record<string, string> = { CA: "Canada", UK: "United Kingdom", AU: "Australia", MY: "Malaysia" };

export function DestinationsStep({ initial }: { initial?: string[] | null }) {
  const [ranked, setRanked] = useState<string[]>(Array.isArray(initial) ? initial : []);
  const [drag, setDrag] = useState<number | null>(null);
  const { status, save } = useAutosave();

  function update(next: string[]) {
    setRanked(next);
    save({ destinations: next });
  }
  function toggle(code: string) {
    update(ranked.includes(code) ? ranked.filter((c) => c !== code) : [...ranked, code]);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= ranked.length) return;
    const copy = [...ranked];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    update(copy);
  }
  function drop(target: number) {
    if (drag === null || drag === target) return;
    const copy = [...ranked];
    const [m] = copy.splice(drag, 1);
    copy.splice(target, 0, m);
    setDrag(null);
    update(copy);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(DESTS).map(([code, name]) => (
          <button
            key={code}
            type="button"
            onClick={() => toggle(code)}
            className={`rounded-xl border px-4 py-4 text-left ${
              ranked.includes(code) ? "border-navy bg-navy/5" : "border-line hover:bg-subtle"
            }`}
          >
            <span className="text-sm font-semibold text-navy">{name}</span>
          </button>
        ))}
      </div>

      {ranked.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-muted">Your ranking (drag or use arrows)</p>
          <ul className="space-y-2">
            {ranked.map((code, i) => (
              <li
                key={code}
                draggable
                onDragStart={() => setDrag(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => drop(i)}
                className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2.5"
              >
                <GripVertical className="h-4 w-4 cursor-grab text-muted" />
                <span className="grid h-6 w-6 place-items-center rounded-full bg-navy text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm text-navy">{DESTS[code]}</span>
                <button type="button" aria-label="Move up" onClick={() => move(i, -1)} className="p-1 text-muted hover:text-navy">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Move down" onClick={() => move(i, 1)} className="p-1 text-muted hover:text-navy">
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Remove" onClick={() => toggle(code)} className="p-1 text-muted hover:text-red-600">
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <SaveBadge status={status} />
    </div>
  );
}
