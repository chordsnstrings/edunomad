"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, AlertTriangle, X, Check } from "lucide-react";

const THRESHOLD = 15;

export function SopEditor({
  studentId,
  initial,
  status,
  score: initScore,
  destination,
  target,
  tone,
  counsellorNote,
}: {
  studentId: string;
  initial: string;
  status: string;
  score: number | null;
  destination: string;
  target: number;
  tone: string;
  counsellorNote: string;
}) {
  const router = useRouter();
  const [content, setContent] = useState(initial);
  const [polished, setPolished] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(initScore);
  const [busy, setBusy] = useState(false);
  const [locked, setLocked] = useState(status === "locked");
  const [showGate, setShowGate] = useState(false);

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const overThreshold = score != null && score > THRESHOLD;

  async function polish() {
    setBusy(true);
    try {
      const r = await fetch("/api/sop/polish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content, destination }) }).then((x) => x.json());
      setPolished(r.polished);
      setSuggestions(r.suggestions ?? []);
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    setBusy(true);
    try {
      const r = await fetch("/api/sop", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId, content }) }).then((x) => x.json());
      if (r.score != null) setScore(r.score);
    } finally {
      setBusy(false);
    }
  }
  async function lock() {
    if (overThreshold) return setShowGate(true);
    setBusy(true);
    try {
      const r = await fetch("/api/sop/lock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId }) });
      if (r.ok) {
        setLocked(true);
        router.refresh();
      } else {
        const d = await r.json();
        if (d.score != null) setScore(d.score);
        setShowGate(true);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <span className={words > target * 1.2 || words < target * 0.6 ? "text-amber-700" : "text-green-700"}>
          {words} / {target} words
        </span>
        {score != null && (
          <span className={overThreshold ? "font-semibold text-red-600" : "text-green-700"}>Plagiarism {score}%</span>
        )}
        {locked && <span className="inline-flex items-center gap-1 rounded-full bg-subtle px-2 py-0.5 text-xs font-medium text-muted"><Lock className="h-3 w-3" /> Locked v{status === "locked" ? "" : ""}</span>}
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-white p-3">
          <p className="text-xs font-semibold text-navy">{destination} tone guide</p>
          <p className="mt-1 text-xs text-muted">{tone}</p>
        </div>
        {counsellorNote && (
          <div className="rounded-xl border border-line bg-white p-3">
            <p className="text-xs font-semibold text-navy">Counsellor notes</p>
            <p className="mt-1 text-xs text-muted">{counsellorNote}</p>
          </div>
        )}
      </div>

      {locked ? (
        <div className="whitespace-pre-wrap rounded-xl border border-line bg-subtle p-4 text-sm text-ink">{content}</div>
      ) : polished ? (
        <div className="grid gap-3 lg:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-semibold text-muted">Current</p>
            <div className="h-64 overflow-y-auto whitespace-pre-wrap rounded-xl border border-line bg-white p-3 text-sm">{content}</div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-gold-700">Polished</p>
            <div className="h-64 overflow-y-auto whitespace-pre-wrap rounded-xl border border-gold-300 bg-gold-50 p-3 text-sm">{polished}</div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => { setContent(polished); setPolished(null); }} className="inline-flex items-center gap-1 rounded-lg bg-navy px-3 py-1.5 text-sm font-semibold text-white"><Check className="h-3.5 w-3.5" /> Apply</button>
              <button onClick={() => setPolished(null)} className="rounded-lg border border-line px-3 py-1.5 text-sm">Discard</button>
            </div>
            {suggestions.length > 0 && (
              <ul className="mt-2 list-disc space-y-0.5 pl-5 text-xs text-muted">{suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
            )}
          </div>
        </div>
      ) : (
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16} className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-navy" />
      )}

      {!locked && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={polish} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-navy px-4 py-2 text-sm font-semibold text-navy hover:bg-subtle disabled:opacity-60">
            <Sparkles className="h-4 w-4" /> Polish with AI
          </button>
          <button onClick={save} disabled={busy} className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60">Save version</button>
          <button onClick={lock} disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60">
            <Lock className="h-4 w-4" /> Lock SOP
          </button>
        </div>
      )}

      {showGate && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/40 px-4" onClick={() => setShowGate(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center gap-2 text-navy">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h2 className="text-base font-semibold">Plagiarism too high</h2>
              <button onClick={() => setShowGate(false)} className="ml-auto text-muted"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-sm text-ink">
              The similarity score is {score}%, above the {THRESHOLD}% threshold. The SOP can&apos;t be locked until it&apos;s below {THRESHOLD}%.
              Rewrite repeated or templated passages in the applicant&apos;s own words, then save and re-check.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
