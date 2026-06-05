"use client";

import { useActionState } from "react";
import {
  confirmEnrollmentAction,
  verifyTwoFactorAction,
  type FormState,
} from "@/app/admin/actions";

const inputClass =
  "w-full rounded-lg border border-line px-3 py-2.5 text-center text-lg tracking-[0.3em] outline-none focus:border-navy";
const btnClass =
  "w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60";

export function EnrollForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(confirmEnrollmentAction, {});
  return (
    <form action={action} className="space-y-3">
      <input name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456" className={inputClass} aria-label="Authentication code" />
      {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
      <button type="submit" disabled={pending} className={btnClass}>
        {pending ? "Verifying…" : "Verify & enable"}
      </button>
    </form>
  );
}

export function VerifyForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(verifyTwoFactorAction, {});
  return (
    <form action={action} className="space-y-3">
      <input name="code" autoComplete="one-time-code" placeholder="123456 or recovery code" className={inputClass} aria-label="Authentication or recovery code" />
      {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
      <button type="submit" disabled={pending} className={btnClass}>
        {pending ? "Verifying…" : "Verify"}
      </button>
    </form>
  );
}
