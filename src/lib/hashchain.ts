import { createHash } from "node:crypto";

/** Deterministic JSON: object keys sorted recursively, Dates as ISO strings.
 *  Ensures identical hashes regardless of property insertion order.
 *
 *  Keys whose value is `undefined` are omitted, because that is what actually
 *  reaches the database: Prisma drops undefined-valued keys when serialising
 *  JSON columns. Hashing them as `null` instead meant the hash was computed over
 *  a different object than the one stored, so re-verifying the row produced a
 *  different digest and the chain reported BROKEN from that entry onward —
 *  permanently, since events are append-only and a DB trigger blocks UPDATE and
 *  DELETE. Payloads with no undefined values serialise byte-identically, so
 *  every previously-valid entry still verifies. */
export function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (value instanceof Date) return JSON.stringify(value.toISOString());
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj)
    .filter((k) => obj[k] !== undefined)
    .sort();
  return (
    "{" +
    keys.map((k) => JSON.stringify(k) + ":" + stableStringify(obj[k])).join(",") +
    "}"
  );
}

export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/** Seed for the first link in any hash chain (events, audit log). */
export const GENESIS_HASH = "EDUNOMAD::GENESIS::v1";

/** chain_hash = sha256( stableJson(content) || previous_chain_hash ). */
export function computeChainHash(
  content: Record<string, unknown>,
  prevHash: string,
): string {
  return sha256Hex(stableStringify(content) + "||" + prevHash);
}
