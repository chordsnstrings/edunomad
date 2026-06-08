"use client";

import { useSyncExternalStore } from "react";
import { Type } from "lucide-react";

/** Opt-in large-font toggle (CLAUDE.md §9). Persists per-browser; applied
 *  before paint by the inline script in the root layout. */
function subscribe(cb: () => void) {
  window.addEventListener("fontscalechange", cb);
  return () => window.removeEventListener("fontscalechange", cb);
}
function getSnapshot() {
  return document.documentElement.dataset.fontScale === "large";
}

export function FontScaleToggle() {
  const large = useSyncExternalStore(subscribe, getSnapshot, () => false);

  function toggle(next: boolean) {
    if (next) document.documentElement.dataset.fontScale = "large";
    else delete document.documentElement.dataset.fontScale;
    try {
      localStorage.setItem("fontScale", next ? "large" : "normal");
    } catch {
      /* storage unavailable — preference simply isn't persisted */
    }
    window.dispatchEvent(new Event("fontscalechange"));
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-4">
      <div className="flex items-center gap-3">
        <Type className="h-5 w-5 shrink-0 text-navy" />
        <div>
          <p className="text-sm font-medium text-ink">Larger text</p>
          <p className="text-xs text-muted">Increase the text size across the app.</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={large}
        aria-label="Larger text"
        onClick={() => toggle(!large)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${large ? "bg-navy" : "bg-line"}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform ${large ? "translate-x-[1.375rem]" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}
