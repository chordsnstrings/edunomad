/**
 * Typed, bounded reads for server-action FormData.
 *
 * Every action read its inputs as `String(formData.get(x))`, which has three
 * failure modes that all reached the database: a missing field becomes the
 * literal string "null" rather than empty; there is no length ceiling, so a
 * free-text field could store megabytes; and a value meant to be one of a fixed
 * set, a number, or a date was never checked to be any of those.
 *
 * These helpers are deliberately total — they return a usable value rather than
 * throwing — because a server action has no error channel to a user who has
 * already navigated. Callers that need to reject bad input check the returned
 * value (`id()` and `pick()` return null when the input is not acceptable).
 */

/** Bounded free text. Missing/`"null"`/`"undefined"` collapse to "". */
export function text(fd: FormData, key: string, max = 2000): string {
  const raw = fd.get(key);
  if (typeof raw !== "string") return "";
  const v = raw.trim();
  if (v === "null" || v === "undefined") return "";
  return v.slice(0, max);
}

/** Required free text: returns null when absent, so the caller can refuse. */
export function requiredText(fd: FormData, key: string, max = 2000): string | null {
  const v = text(fd, key, max);
  return v === "" ? null : v;
}

/**
 * An identifier we are about to look up. Anything that is not plausibly one of
 * our ids (uuid, cuid, slug) is rejected rather than sent to the database as a
 * query parameter — a 200-character "id" is never a real one.
 */
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
export function id(fd: FormData, key: string): string | null {
  // Read unbounded and then test: truncating first would turn a 200-character
  // value into a 64-character one that passes, which is the opposite of
  // rejecting it.
  const raw = fd.get(key);
  if (typeof raw !== "string") return null;
  const v = raw.trim();
  return ID_RE.test(v) ? v : null;
}

/** A value that must be one of a fixed set. Returns null for anything else. */
export function pick<T extends string>(
  fd: FormData,
  key: string,
  allowed: readonly T[],
): T | null {
  const v = text(fd, key, 64);
  return (allowed as readonly string[]).includes(v) ? (v as T) : null;
}

/** An integer within bounds; out-of-range and non-numeric fall back. */
export function int(
  fd: FormData,
  key: string,
  opts: { min?: number; max?: number; fallback?: number } = {},
): number {
  const { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER, fallback = 0 } = opts;
  const n = Number.parseInt(text(fd, key, 32), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/** A checkbox: present and not "false"/"off"/"0" means true. */
export function bool(fd: FormData, key: string): boolean {
  const v = text(fd, key, 16).toLowerCase();
  return v !== "" && v !== "false" && v !== "off" && v !== "0";
}

/** A date input. Returns null for absent or unparseable values. */
export function date(fd: FormData, key: string): Date | null {
  const v = text(fd, key, 40);
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * A secret exactly as typed. Never trimmed and never collapsed: whitespace can
 * be part of a passphrase, and silently changing a credential before hashing it
 * makes a correct password fail. Still bounded, so a login attempt cannot ship
 * a megabyte into the hash function.
 */
export function secret(fd: FormData, key: string, max = 512): string {
  const raw = fd.get(key);
  return typeof raw === "string" ? raw.slice(0, max) : "";
}

/**
 * Structured JSON posted by an editor. Needs a far larger ceiling than free
 * text — an SOP article is many kilobytes — but still a ceiling.
 */
export function json(fd: FormData, key: string, max = 512_000): string {
  const raw = fd.get(key);
  return typeof raw === "string" ? raw.slice(0, max) : "";
}

/** Common ceilings, named so they read the same at every call site. */
export const LIMITS = {
  /** A note, message, reason or rationale a person typed. */
  longText: 4000,
  /** A single-line reason / title / label. */
  line: 500,
  /** A name. */
  name: 120,
} as const;
