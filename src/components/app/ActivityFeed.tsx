"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

type Item = { id: string; rendered: string; createdAt: string; read: boolean };

export function ActivityFeed() {
  const [items, setItems] = useState<Item[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const startY = useRef(0);

  async function load(reset = false) {
    if (loading) return;
    setLoading(true);
    try {
      const c = reset ? null : cursor;
      const res = await fetch(`/api/feed${c ? `?cursor=${c}` : ""}`);
      const data = await res.json();
      const next: Item[] = data.items ?? [];
      setItems((cur) => (reset ? next : [...cur, ...next]));
      setCursor(data.nextCursor);
      setDone(!data.nextCursor);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function markRead(id: string) {
    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, read: true } : i)));
    await fetch("/api/feed/read", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventId: id }) });
  }

  return (
    <div
      onTouchStart={(e) => (startY.current = e.touches[0].clientY)}
      onTouchEnd={(e) => {
        if (window.scrollY === 0 && e.changedTouches[0].clientY - startY.current > 80) load(true);
      }}
    >
      <button onClick={() => load(true)} className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
      </button>

      {loaded && items.length === 0 ? (
        <EmptyState title="Nothing yet" body="Updates about your applications and messages will show up here." />
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => !it.read && markRead(it.id)}
                className="flex w-full items-start gap-3 rounded-xl border border-line bg-white p-3.5 text-left"
              >
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${it.read ? "bg-transparent" : "bg-gold-500"}`} />
                <div>
                  <p className="text-sm text-ink">{it.rendered}</p>
                  <p className="text-xs text-muted">{new Date(it.createdAt).toLocaleString()}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!done && items.length > 0 && (
        <button onClick={() => load(false)} disabled={loading} className="mt-3 w-full rounded-lg border border-line py-2.5 text-sm font-medium text-navy hover:bg-subtle disabled:opacity-60">
          {loading ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
