// Offline write queue. Stores pending requests while offline and replays them
// on reconnect. The core works on an injectable store so it is unit-testable;
// the browser binding uses IndexedDB.

export type QueuedRequest = {
  id: string;
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
  queuedAt: number;
};

export interface QueueStore {
  add(req: QueuedRequest): Promise<void>;
  all(): Promise<QueuedRequest[]>;
  remove(id: string): Promise<void>;
}

export class MemoryQueueStore implements QueueStore {
  private items: QueuedRequest[] = [];
  async add(req: QueuedRequest) {
    this.items.push(req);
  }
  async all() {
    return [...this.items];
  }
  async remove(id: string) {
    this.items = this.items.filter((i) => i.id !== id);
  }
}

function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function enqueueRequest(
  store: QueueStore,
  req: Omit<QueuedRequest, "id" | "queuedAt">,
): Promise<QueuedRequest> {
  const item: QueuedRequest = { id: newId(), queuedAt: Date.now(), ...req };
  await store.add(item);
  return item;
}

type Fetcher = (url: string, init: RequestInit) => Promise<{ ok: boolean }>;

/** Replay queued requests oldest-first; remove on success. */
export async function flushQueue(
  store: QueueStore,
  fetcher: Fetcher = fetch as unknown as Fetcher,
): Promise<{ synced: number; failed: number }> {
  const items = (await store.all()).sort((a, b) => a.queuedAt - b.queuedAt);
  let synced = 0;
  let failed = 0;
  for (const it of items) {
    try {
      const res = await fetcher(it.url, { method: it.method, headers: it.headers, body: it.body });
      if (res.ok) {
        await store.remove(it.id);
        synced++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }
  return { synced, failed };
}

// ── Browser IndexedDB store ──────────────────────────────────────────
const DB_NAME = "edunomad-offline";
const STORE = "queue";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function getIndexedDbStore(): QueueStore | null {
  if (typeof indexedDB === "undefined") return null;
  return {
    async add(req) {
      const db = await openDb();
      await new Promise<void>((res, rej) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(req);
        tx.oncomplete = () => res();
        tx.onerror = () => rej(tx.error);
      });
    },
    async all() {
      const db = await openDb();
      return new Promise<QueuedRequest[]>((res, rej) => {
        const tx = db.transaction(STORE, "readonly");
        const r = tx.objectStore(STORE).getAll();
        r.onsuccess = () => res(r.result as QueuedRequest[]);
        r.onerror = () => rej(r.error);
      });
    },
    async remove(id) {
      const db = await openDb();
      await new Promise<void>((res, rej) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).delete(id);
        tx.oncomplete = () => res();
        tx.onerror = () => rej(tx.error);
      });
    },
  };
}
