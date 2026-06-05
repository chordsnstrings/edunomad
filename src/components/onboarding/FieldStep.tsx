"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { FIELD_CATEGORIES } from "@/lib/reference/fields";
import { useAutosave, SaveBadge } from "./useAutosave";

export function FieldStep({ initial }: { initial?: { fieldCategory?: string; fieldOfStudy?: string } }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(initial?.fieldCategory ?? "");
  const [sub, setSub] = useState(initial?.fieldOfStudy ?? "");
  const { status, save } = useAutosave();

  const categories = FIELD_CATEGORIES.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));
  const selected = FIELD_CATEGORIES.find((c) => c.id === cat);

  return (
    <div className="space-y-4">
      {!selected && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search fields…"
              className="w-full rounded-lg border border-line py-2.5 pl-9 pr-3 outline-none focus:border-navy"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                className="rounded-xl border border-line px-3 py-3 text-left text-sm font-medium text-navy hover:bg-subtle"
              >
                {c.label}
              </button>
            ))}
          </div>
        </>
      )}

      {selected && (
        <div>
          <button type="button" onClick={() => setCat("")} className="mb-3 text-sm text-muted hover:text-navy">
            ← {selected.label}
          </button>
          <div className="flex flex-wrap gap-2">
            {selected.subcategories.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSub(s);
                  save({ fieldCategory: selected.id, fieldOfStudy: s });
                }}
                className={`rounded-full border px-3 py-2 text-sm ${
                  sub === s ? "border-navy bg-navy text-white" : "border-line text-navy hover:bg-subtle"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      <SaveBadge status={status} />
    </div>
  );
}
