"use client";

import { useState } from "react";

export function NotesEditor({ studentId, initial }: { studentId: string; initial: string }) {
  const [body, setBody] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, body }),
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-semibold text-navy">Private notes</label>
        {status !== "idle" && (
          <span className={`text-xs ${status === "error" ? "text-red-600" : "text-muted"}`}>
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : "Couldn't save"}
          </span>
        )}
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onBlur={save}
        rows={5}
        placeholder="Call notes, next steps, context…"
        className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-navy"
      />
    </div>
  );
}
