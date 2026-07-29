"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, AlertTriangle, X } from "lucide-react";
import { checkGuards } from "@/lib/compliance";
import type { ComplianceGuard } from "@/lib/reference/scripts";

type Tpl = { id: string; body: string; variables: number; approvedInLang: boolean };

function render(body: string, vars: string[]) {
  return body.replace(/\{\{(\d+)\}\}/g, (_, n: string) => vars[Number(n) - 1] || `{{${n}}}`);
}
function initVars(tpl: Tpl | undefined, defaults: string[]) {
  if (!tpl) return [];
  return Array.from({ length: tpl.variables }, (_, i) => defaults[i] ?? "");
}

export function WhatsAppComposer({
  studentId,
  templates,
  defaults,
}: {
  studentId: string;
  templates: Tpl[];
  defaults: string[];
}) {
  const router = useRouter();
  const [id, setId] = useState(templates[0]?.id ?? "");
  const tpl = templates.find((t) => t.id === id);
  const [vars, setVars] = useState<string[]>(() => initVars(tpl, defaults));
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  function pick(nextId: string) {
    setId(nextId);
    setVars(initVars(templates.find((t) => t.id === nextId), defaults));
  }

  const [guard, setGuard] = useState<ComplianceGuard | null>(null);

  function send() {
    // Local check for instant feedback only. The server re-checks against the
    // same guards plus any a manager published through the SOP CMS, and is the
    // one that decides — this hint can be skipped, that check cannot.
    const g = checkGuards(render(tpl?.body ?? "", vars));
    if (g) {
      setGuard(g); // compliance guard tripped on send-button click
      return;
    }
    void doSend();
  }

  async function doSend(acknowledgedGuardId?: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, templateId: id, variables: vars, acknowledgedGuardId }),
      });
      if (res.status === 409) {
        // The server tripped a guard the browser did not know about.
        const data = (await res.json().catch(() => ({}))) as { guard?: ComplianceGuard };
        if (data.guard) setGuard(data.guard);
        return;
      }
      if (res.ok) {
        setSent(true);
        setTimeout(() => router.push(`/counsellor/leads/${studentId}`), 700);
      }
    } finally {
      setBusy(false);
    }
  }

  async function override() {
    if (!guard) return;
    const acknowledged = guard.id;
    setGuard(null);
    // The send route records the override itself, so this no longer posts a
    // separate flag: the old flow logged one on the client path and none at all
    // when the guard was only caught server-side.
    await doSend(acknowledged);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy">Template</label>
        <select value={id} onChange={(e) => pick(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-navy">
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.id}{t.approvedInLang ? "" : " (EN)"}
            </option>
          ))}
        </select>
      </div>

      {vars.map((v, i) => (
        <div key={i}>
          <label className="mb-1 block text-xs text-muted">Variable {`{{${i + 1}}}`}</label>
          <input
            value={v}
            onChange={(e) => setVars((cur) => cur.map((x, j) => (j === i ? e.target.value : x)))}
            className="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-navy"
          />
        </div>
      ))}

      <div>
        <p className="mb-1.5 text-sm font-medium text-navy">Preview</p>
        <div className="rounded-xl border border-line bg-subtle p-3 text-sm text-ink">
          {render(tpl?.body ?? "", vars)}
        </div>
      </div>

      <button type="button" onClick={send} disabled={busy || sent} className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60">
        <Send className="h-4 w-4" /> {sent ? "Sent" : busy ? "Sending…" : "Send WhatsApp"}
      </button>

      {guard && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5">
            <div className="mb-2 flex items-center gap-2 text-navy">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h2 className="text-base font-semibold">Compliance check</h2>
              <button onClick={() => setGuard(null)} className="ml-auto text-muted"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-sm leading-relaxed text-ink">{guard.modalText}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setGuard(null)} className="flex-1 rounded-lg border border-line py-2 text-sm font-semibold text-navy hover:bg-subtle">
                Rephrase
              </button>
              <button onClick={override} className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700">
                Continue anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
