"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/** Registers the service worker and surfaces an install prompt when available. */
export function PwaController() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => setShow(false));
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!show || !deferred) return null;

  return (
    <div className="bottom-safe fixed inset-x-0 z-[70] mx-auto flex max-w-md items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-sm shadow-black/5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold-100 text-gold-600">
        <Download className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-navy">Install EduNomad</p>
        <p className="text-xs text-muted">Add to your home screen for quick access.</p>
      </div>
      <button
        type="button"
        onClick={async () => {
          await deferred.prompt();
          await deferred.userChoice;
          setShow(false);
        }}
        className="rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-white hover:bg-navy-700"
      >
        Install
      </button>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setShow(false)}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted hover:bg-subtle"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
