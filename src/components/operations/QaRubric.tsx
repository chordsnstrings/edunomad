"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export function QaRubric({ documentId, items }: { documentId: string; items: string[] }) {
  const router = useRouter();
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const passedCount = items.filter((_, i) => checks[i]).length;
  const passedAll = passedCount === items.length;

  async function submit(decision: "approve" | "rework") {
    setBusy(true);
    try {
      const map: Record<string, boolean> = {};
      items.forEach((it, i) => (map[it] = !!checks[i]));
      await fetch("/api/documents/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, items: map, decision, reworkReason: reason }),
      });
      router.back();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">{passedCount} / {items.length} checks passed</p>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white px-3 py-2 text-sm">
            <span className="text-ink">{it}</span>
            <button
              type="button"
              onClick={() => setChecks((c) => ({ ...c, [i]: !c[i] }))}
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${checks[i] ? "bg-green-600 text-white" : "bg-subtle text-muted"}`}
              aria-label={checks[i] ? "Passed" : "Mark passed"}
            >
              {checks[i] ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
            </button>
          </li>
        ))}
      </ul>

      <div className="sticky bottom-0 mt-4 space-y-2 bg-subtle py-3">
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Rework reason (if requesting rework)" className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-navy" />
        <div className="flex gap-2">
          <button onClick={() => submit("approve")} disabled={busy || !passedAll} className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
            Approve
          </button>
          <button onClick={() => submit("rework")} disabled={busy} className="flex-1 rounded-lg bg-navy py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60">
            Request rework
          </button>
        </div>
      </div>
    </div>
  );
}
