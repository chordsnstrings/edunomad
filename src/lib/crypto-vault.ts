import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { authSecret } from "./auth-secret";

// AES-256-GCM symmetric encryption for stored secrets (portal credentials).
// Key derived from AUTH_SECRET; rotate by re-encrypting on secret change.
function vaultKey(): Buffer {
  return scryptSync(authSecret(), "edunomad-vault", 32);
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", vaultKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

export function decryptSecret(b64: string): string {
  const buf = Buffer.from(b64, "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const enc = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", vaultKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
}
