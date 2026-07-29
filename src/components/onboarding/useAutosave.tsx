"use client";

import { useT } from "@/i18n/LocaleProvider";
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
  // Hook before any early return — hooks must run in the same order every render.
  const t = useT();
  if (status === "idle") return null;
  const text = status === "saving" ? t("common.saving") : status === "saved" ? t("common.saved") : t("common.save_failed");
  const color = status === "error" ? "text-red-600" : "text-muted";
  return <span className={`text-xs ${color}`}>{text}</span>;
}
