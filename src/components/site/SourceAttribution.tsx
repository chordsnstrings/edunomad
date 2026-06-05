"use client";

import { useEffect } from "react";
import { ATTRIBUTION_KEY, ATTRIBUTION_PARAMS } from "@/lib/attribution";

/** Capture UTM / referral / fair-QR params to sessionStorage (first-touch). */
export function SourceAttribution() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const captured: Record<string, string> = {};
      for (const key of ATTRIBUTION_PARAMS) {
        const v = params.get(key);
        if (v) captured[key] = v;
      }
      if (Object.keys(captured).length > 0 && !sessionStorage.getItem(ATTRIBUTION_KEY)) {
        sessionStorage.setItem(
          ATTRIBUTION_KEY,
          JSON.stringify({ ...captured, landed_at: new Date().toISOString() }),
        );
      }
    } catch {
      /* sessionStorage unavailable — ignore */
    }
  }, []);
  return null;
}
