"use client";

import { useState } from "react";
import { Input } from "./Field";
import { cn } from "@/lib/utils";

/** E.164-ish phone validity (10–15 digits, optional leading +). */
export function isValidPhone(value: string) {
  return /^\+?[1-9]\d{9,14}$/.test(value.replace(/[\s-]/g, ""));
}

/** Phone input with inline validation (shown after blur). */
export function PhoneInput({
  name = "phone",
  defaultValue = "",
  required,
  onValidChange,
}: {
  name?: string;
  defaultValue?: string;
  required?: boolean;
  onValidChange?: (valid: boolean) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const [touched, setTouched] = useState(false);
  const valid = isValidPhone(value);
  const showError = touched && value.length > 0 && !valid;

  return (
    <div className="space-y-1.5">
      <Input
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+8801XXXXXXXXX"
        value={value}
        required={required}
        aria-invalid={showError || undefined}
        onChange={(e) => {
          setValue(e.target.value);
          onValidChange?.(isValidPhone(e.target.value));
        }}
        onBlur={() => setTouched(true)}
        className={cn(showError && "border-red-400")}
      />
      {showError && (
        <p className="text-xs font-medium text-red-600">
          Enter a valid phone number with country code.
        </p>
      )}
    </div>
  );
}
