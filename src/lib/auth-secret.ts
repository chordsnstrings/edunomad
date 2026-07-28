/**
 * The single source of the application signing/derivation secret.
 *
 * Every keyed hash in the app — session tokens, OTP hashes, 2FA codes, parent
 * PINs, the credential vault, storage signatures — derives from AUTH_SECRET. Each
 * call site used to inline its own `process.env.AUTH_SECRET ?? "dev-insecure-..."`
 * fallback, so a production deploy that forgot to set AUTH_SECRET would silently
 * key all of them off a constant that is public in this repository (forgeable
 * sessions, predictable OTPs and 2FA codes, a decryptable vault). Only the admin
 * JWT guarded against that.
 *
 * Now the fallback exists only outside production, and production fails fast.
 */
export function authSecret(devFallback = "dev-insecure-secret"): string {
  const secret = process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production");
  }
  return devFallback;
}
