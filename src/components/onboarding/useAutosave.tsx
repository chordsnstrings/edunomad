"use client";

import { useCallback, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

/** Autosave a partial profile patch to PATCH /api/profile (≤500ms target). */
export function useAutosave() {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const save = useCallback(async (patch: Record<string, unknown>) => {
    setStatus("saving");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }, []);
  return { status, save };
}

export function SaveBadge({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  const text = status === "saving" ? "Saving…" : status === "saved" ? "Saved" : "Couldn't save";
  const color = status === "error" ? "text-red-600" : "text-muted";
  return <span className={`text-xs ${color}`}>{text}</span>;
}
