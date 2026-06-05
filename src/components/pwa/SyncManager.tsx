"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { flushQueue, getIndexedDbStore } from "@/lib/offline/syncQueue";

/** Flushes the offline write queue on reconnect and confirms with a toast. */
export function SyncManager() {
  const toast = useToast();
  useEffect(() => {
    const store = getIndexedDbStore();
    if (!store) return;
    let active = true;
    async function sync() {
      const { synced } = await flushQueue(store!);
      if (active && synced > 0) {
        toast({ kind: "success", message: `Synced ${synced} change${synced > 1 ? "s" : ""}.` });
      }
    }
    window.addEventListener("online", sync);
    if (navigator.onLine) sync();
    return () => {
      active = false;
      window.removeEventListener("online", sync);
    };
  }, [toast]);
  return null;
}
