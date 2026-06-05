"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

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

  async function send() {
    setBusy(true);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, templateId: id, variables: vars }),
      });
      if (res.ok) {
        setSent(true);
        setTimeout(() => router.push(`/counsellor/leads/${studentId}`), 700);
      }
    } finally {
      setBusy(false);
    }
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
    </div>
  );
}
