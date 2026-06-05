"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, PhoneOff, Circle } from "lucide-react";

// Telephony + transcription are mocked pending an integrated provider (Twilio
// Voice / realtime STT). The interface — recording, streaming transcript,
// outcome — is in place so the provider swaps in without UI changes.
const MOCK_TRANSCRIPT = [
  "Counsellor: Hi, this is EduNomad calling about your application.",
  "Student: Hello, yes — thanks for reaching out.",
  "Counsellor: Let's confirm your target intake and budget.",
  "Student: September intake, around 20,000 USD a year.",
];
const OUTCOMES = [
  { id: "hot", label: "Hot" },
  { id: "qualified", label: "Qualified" },
  { id: "warm", label: "Warm" },
  { id: "cold", label: "Cold" },
];

export function Dialer({ studentId, phone, studentName }: { studentId: string; phone: string; studentName: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "connecting" | "connected" | "ended">("idle");
  const [transcript, setTranscript] = useState("");
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("");
  const [seconds, setSeconds] = useState(0);
  const lineRef = useRef(0);

  useEffect(() => {
    if (state !== "connected") return;
    const tick = setInterval(() => setSeconds((s) => s + 1), 1000);
    const stream = setInterval(() => {
      const line = MOCK_TRANSCRIPT[lineRef.current++];
      if (line) setTranscript((t) => (t ? t + "\n" : "") + line);
    }, 2500);
    return () => {
      clearInterval(tick);
      clearInterval(stream);
    };
  }, [state]);

  function call() {
    setState("connecting");
    setTimeout(() => setState("connected"), 900);
  }

  async function save() {
    if (!outcome) return;
    await fetch("/api/calls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, transcript, notes, outcomeTag: outcome, durationSec: seconds }),
    });
    router.push(`/counsellor/leads/${studentId}/summary`);
  }

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="max-w-md space-y-4">
      <div className="rounded-2xl border border-line bg-white p-5 text-center">
        <p className="text-sm text-muted">{studentName}</p>
        <p className="text-lg font-semibold tracking-wide text-navy">{phone}</p>
        {state === "connected" && (
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-red-600">
            <Circle className="h-3 w-3 animate-pulse fill-current" /> Recording · {mmss}
          </p>
        )}
        <div className="mt-4">
          {state === "idle" && (
            <button onClick={call} className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700">
              <Phone className="h-4 w-4" /> Call
            </button>
          )}
          {state === "connecting" && <p className="text-sm text-muted">Connecting…</p>}
          {state === "connected" && (
            <button onClick={() => setState("ended")} className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700">
              <PhoneOff className="h-4 w-4" /> End call
            </button>
          )}
        </div>
      </div>

      {state !== "idle" && state !== "connecting" && (
        <>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">Live transcript</label>
            <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} rows={5} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">Notes during call</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy" />
          </div>
        </>
      )}

      {state === "ended" && (
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="mb-2 text-sm font-medium text-navy">Outcome</p>
          <div className="grid grid-cols-4 gap-2">
            {OUTCOMES.map((o) => (
              <button key={o.id} type="button" onClick={() => setOutcome(o.id)} className={`rounded-lg border px-2 py-2 text-sm font-semibold ${outcome === o.id ? "border-navy bg-navy text-white" : "border-line text-navy hover:bg-subtle"}`}>
                {o.label}
              </button>
            ))}
          </div>
          <button onClick={save} disabled={!outcome} className="mt-4 w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60">
            Save call
          </button>
        </div>
      )}
    </div>
  );
}
