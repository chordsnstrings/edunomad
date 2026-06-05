"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { isValidPhone } from "@/components/ui/PhoneInput";

/** OTP login for internal staff (existing users only — no provisioning). */
export function StaffLogin({ redirectTo = "/counsellor" }: { redirectTo?: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);

  async function send() {
    if (!isValidPhone(phone)) return setError("Enter a valid phone number.");
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) });
      const data = await res.json();
      if (!res.ok) return setError("Couldn't send the code.");
      if (data.devCode) setDevCode(data.devCode);
      setPhase("code");
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    if (!/^\d{6}$/.test(code)) return setError("Enter the 6-digit code.");
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, code }) });
      if (!res.ok) return setError("Invalid code.");
      router.push(redirectTo);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-6 shadow-sm shadow-black/5">
      <div className="mb-5 flex flex-col items-center text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-navy text-gold-400">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <h1 className="mt-3 text-lg font-semibold text-navy">Counsellor sign in</h1>
        <p className="mt-1 text-sm text-muted">{phase === "phone" ? "Sign in with your work number." : `Code sent to ${phone}.`}</p>
      </div>
      {phase === "phone" ? (
        <div className="space-y-3">
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+8801XXXXXXXXX" className="w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-navy" />
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button type="button" onClick={send} disabled={busy} className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60">{busy ? "Sending…" : "Send code"}</button>
        </div>
      ) : (
        <div className="space-y-3">
          <input inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" className="w-full rounded-lg border border-line px-3 py-2.5 text-center text-lg tracking-[0.3em] outline-none focus:border-navy" />
          {devCode && <p className="text-center text-xs text-muted">Dev code: {devCode}</p>}
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button type="button" onClick={verify} disabled={busy} className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60">{busy ? "Verifying…" : "Sign in"}</button>
        </div>
      )}
    </div>
  );
}
