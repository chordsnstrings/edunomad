"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { isValidPhone } from "@/components/ui/PhoneInput";
import { ATTRIBUTION_KEY } from "@/lib/attribution";

export function SignupFlow() {
  const router = useRouter();
  const [phase, setPhase] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);

  async function sendCode() {
    if (!isValidPhone(phone)) return setError("Enter a valid phone number with country code.");
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === "rate_limited" ? "Too many requests — try again later." : "Couldn't send the code.");
        return;
      }
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
      let attribution: unknown = null;
      try {
        attribution = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "null");
      } catch {
        /* ignore */
      }
      const res = await fetch("/api/signup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, attribution }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error === "locked"
            ? "Too many wrong attempts. Try again later."
            : data.error === "expired"
              ? "That code expired — resend a new one."
              : "Invalid code.",
        );
        return;
      }
      router.push("/welcome");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-6 shadow-sm shadow-black/5">
      <div className="mb-5 flex flex-col items-center text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-navy text-gold-400">
          <Phone className="h-6 w-6" />
        </span>
        <h1 className="mt-3 text-lg font-semibold text-navy">
          {phase === "phone" ? "Start your journey" : "Enter your code"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {phase === "phone"
            ? "We'll text a 6-digit code to verify your number."
            : `Sent to ${phone}.`}
        </p>
      </div>

      {phase === "phone" ? (
        <div className="space-y-3">
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+8801XXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-navy"
          />
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            type="button"
            onClick={sendCode}
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send code"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2.5 text-center text-lg tracking-[0.3em] outline-none focus:border-navy"
          />
          {devCode && <p className="text-center text-xs text-muted">Dev code: {devCode}</p>}
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            type="button"
            onClick={verify}
            disabled={busy}
            className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
          >
            {busy ? "Verifying…" : "Verify & continue"}
          </button>
          <button
            type="button"
            onClick={() => setPhase("phone")}
            className="w-full text-center text-sm text-muted hover:text-navy"
          >
            Change number
          </button>
        </div>
      )}
    </div>
  );
}
