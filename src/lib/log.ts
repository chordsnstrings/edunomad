// Structured logging (G185).
//
// - Emits one JSON object per line (log-aggregator friendly: Loki, CloudWatch,
//   Datadog, GCP — all parse JSON lines natively).
// - PII is redacted at INFO and above. DEBUG keeps full detail but is OFF in
//   production (min level is INFO there), so production never emits PII.
// - Document binary / base64 / data-URIs are NEVER logged, at any level
//   (CLAUDE.md §11). Long opaque strings are summarised as "[binary N chars]".
//
// Aggregation: stdout JSON lines are collected by the platform's log driver
// (see docs/cc/observability.md). LOG_LEVEL overrides the default per env.

export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_RANK: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function defaultMinLevel(): LogLevel {
  const env = (process.env.LOG_LEVEL ?? "").toLowerCase();
  if (env === "debug" || env === "info" || env === "warn" || env === "error") return env;
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

// Keys whose values are PII / secrets and must be redacted at INFO+.
const PII_KEYS = new Set([
  "phone", "mobile", "email", "name", "fullname", "full_name", "firstname",
  "lastname", "dob", "dateofbirth", "address", "passport", "passportnumber",
  "nid", "code", "otp", "otpcode", "password", "secret", "token",
  "authorization", "cookie", "sessiontoken", "apikey", "api_key", "ssn",
  "card", "cardnumber", "iban", "account", "accountnumber",
]);

const REDACTED = "[redacted]";

function looksBinary(s: string): boolean {
  if (s.length > 512) return true; // opaque blob — never log in full
  if (s.startsWith("data:") && s.includes(";base64,")) return true;
  // long, unbroken base64-ish run
  return /^[A-Za-z0-9+/=]{120,}$/.test(s);
}

function scrubString(s: string): string {
  return looksBinary(s) ? `[binary ${s.length} chars]` : s;
}

/** Recursively redact PII keys + binary blobs. `redact=false` keeps values
 *  (DEBUG only) but still strips binary content unconditionally. */
export function scrub(value: unknown, redact: boolean, depth = 0): unknown {
  if (depth > 6) return "[depth]";
  if (value == null) return value;
  if (typeof value === "string") return scrubString(value);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (value instanceof Date) return value.toISOString();
  if (Buffer.isBuffer(value)) return `[binary ${value.length} bytes]`;
  if (value instanceof Uint8Array) return `[binary ${value.length} bytes]`;
  if (Array.isArray(value)) return value.map((v) => scrub(v, redact, depth + 1));
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (redact && PII_KEYS.has(k.toLowerCase())) {
        out[k] = REDACTED;
      } else {
        out[k] = scrub(v, redact, depth + 1);
      }
    }
    return out;
  }
  return String(value);
}

export type LogFields = Record<string, unknown>;

export type Logger = {
  debug: (msg: string, fields?: LogFields) => void;
  info: (msg: string, fields?: LogFields) => void;
  warn: (msg: string, fields?: LogFields) => void;
  error: (msg: string, fields?: LogFields) => void;
  child: (bindings: LogFields) => Logger;
};

export type LoggerOptions = {
  sink?: (line: string) => void;
  minLevel?: LogLevel;
  bindings?: LogFields;
};

export function createLogger(opts: LoggerOptions = {}): Logger {
  const sink = opts.sink ?? ((line: string) => process.stdout.write(line + "\n"));
  const bindings = opts.bindings ?? {};

  function emit(level: LogLevel, msg: string, fields?: LogFields) {
    const minLevel = opts.minLevel ?? defaultMinLevel();
    if (LEVEL_RANK[level] < LEVEL_RANK[minLevel]) return;
    // Redact at INFO and above; DEBUG keeps detail (and is off in prod).
    const redact = level !== "debug";
    const merged = { ...bindings, ...(fields ?? {}) };
    const record = {
      ts: new Date().toISOString(),
      level,
      msg,
      ...(scrub(merged, redact) as Record<string, unknown>),
    };
    try {
      sink(JSON.stringify(record));
    } catch {
      sink(JSON.stringify({ ts: new Date().toISOString(), level, msg }));
    }
  }

  return {
    debug: (m, f) => emit("debug", m, f),
    info: (m, f) => emit("info", m, f),
    warn: (m, f) => emit("warn", m, f),
    error: (m, f) => emit("error", m, f),
    child: (b) => createLogger({ ...opts, bindings: { ...bindings, ...b } }),
  };
}

export const log = createLogger();
