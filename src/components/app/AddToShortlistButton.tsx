"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function AddToShortlistButton({ programmeId, initialAdded = false }: { programmeId: string; initialAdded?: boolean }) {
  const [added, setAdded] = useState(initialAdded);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function add() {
    setBusy(true);
    try {
      const res = await fetch("/api/shortlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ programmeId }) });
      if (res.ok) {
        setAdded(true);
        toast({ kind: "success", message: "Added to your shortlist." });
      } else {
        const d = await res.json();
        toast({ kind: "error", message: d.error === "max_reached" ? "Shortlist is full (6 max)." : "Couldn't add." });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={add}
      disabled={busy || added}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
    >
      {added ? <><Check className="h-4 w-4" /> On your shortlist</> : <><Plus className="h-4 w-4" /> Add to shortlist</>}
    </button>
  );
}
