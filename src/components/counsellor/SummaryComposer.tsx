"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

export function SummaryComposer({ studentId, initial }: { studentId: string; initial: string }) {
  const router = useRouter();
  const [text, setText] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function send() {
    setBusy(true);
    try {
      const res = await fetch("/api/summary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId, text }) });
      if (res.ok) router.push(`/counsellor/leads/${studentId}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md space-y-3">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy" />
      <button onClick={send} disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60">
        <Send className="h-4 w-4" /> {busy ? "Sending…" : "Review & send summary"}
      </button>
    </div>
  );
}
