"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

const KEY = "en_parent_pin";
const UNLOCKED = "en_parent_unlocked";

function hash(pin: string) {
  let h = 5381;
  for (const c of pin) h = (h * 33) ^ c.charCodeAt(0);
  return (h >>> 0).toString(36);
}

/** Convenience PIN lock for the parent app (re-enter on open). */
export function AppLock() {
  const [needPin, setNeedPin] = useState(false);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored && sessionStorage.getItem(UNLOCKED) !== "1") setNeedPin(true);
  }, []);

  if (!needPin) return null;

  function unlock() {
    if (localStorage.getItem(KEY) === hash(pin)) {
      sessionStorage.setItem(UNLOCKED, "1");
      setNeedPin(false);
    } else {
      setErr(true);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-white px-4">
      <div className="w-full max-w-xs text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy text-gold-400"><Lock className="h-6 w-6" /></span>
        <h1 className="mt-3 text-lg font-semibold text-navy">Enter your PIN</h1>
        <input value={pin} onChange={(e) => { setPin(e.target.value); setErr(false); }} inputMode="numeric" type="password" className="mt-3 w-full rounded-lg border border-line px-3 py-2.5 text-center text-lg tracking-[0.3em]" />
        {err && <p className="mt-1 text-sm text-red-600">Incorrect PIN.</p>}
        <button onClick={unlock} className="mt-3 w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white">Unlock</button>
      </div>
    </div>
  );
}

export function AppLockSettings() {
  const [hasPin, setHasPin] = useState(false);
  const [pin, setPin] = useState("");
  useEffect(() => setHasPin(!!localStorage.getItem(KEY)), []);

  function save() {
    if (!/^\d{4,6}$/.test(pin)) return;
    localStorage.setItem(KEY, hash(pin));
    sessionStorage.setItem(UNLOCKED, "1");
    setHasPin(true);
    setPin("");
  }
  function clear() {
    localStorage.removeItem(KEY);
    setHasPin(false);
  }

  return (
    <div>
      {hasPin ? (
        <button onClick={clear} className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-navy hover:bg-subtle">Turn off app lock</button>
      ) : (
        <div className="flex gap-2">
          <input value={pin} onChange={(e) => setPin(e.target.value)} inputMode="numeric" placeholder="Set a 4–6 digit PIN" aria-label="Set a 4–6 digit PIN" className="flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
          <button onClick={save} className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">Set PIN</button>
        </div>
      )}
    </div>
  );
}
