"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function OfferActions({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function respond(decision: "accept" | "decline") {
    if (decision === "decline" && !confirm("Decline this offer? This can't be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/offers/respond", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ applicationId, decision }) });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 flex gap-2">
      <button onClick={() => respond("accept")} disabled={busy} className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60">Accept</button>
      <button onClick={() => respond("decline")} disabled={busy} className="flex-1 rounded-lg border border-line py-2.5 text-sm font-semibold text-navy hover:bg-subtle disabled:opacity-60">Decline</button>
    </div>
  );
}
