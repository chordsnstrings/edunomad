/**
 * Resolve the client IP for rate-limiting.
 *
 * `X-Forwarded-For` is a list the client can seed: a request that arrives with
 * `X-Forwarded-For: <random>` produces `<random>, <real ip>` after the load
 * balancer appends. Reading the *leftmost* entry therefore let anyone mint a
 * fresh rate-limit bucket per request by varying one header — the limiter was
 * effectively off for anonymous traffic.
 *
 * The trustworthy value is the entry the infrastructure appended, counted from
 * the right: with one proxy in front (DigitalOcean App Platform's default) that
 * is the last entry. `TRUSTED_PROXY_HOPS` raises it when another CDN sits in
 * front, so the setting matches the deployment rather than being guessed.
 */
export const TRUSTED_PROXY_HOPS = Math.max(
  1,
  Number.parseInt(process.env.TRUSTED_PROXY_HOPS ?? "1", 10) || 1,
);

export function clientIpFrom(
  headers: { get(name: string): string | null },
  hops = TRUSTED_PROXY_HOPS,
): string | null {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const chain = xff
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    // Count from the right; if the chain is shorter than expected (direct hit,
    // or a hop that did not forward), fall back to the leftmost real entry
    // rather than to nothing.
    const ip = chain[chain.length - hops] ?? chain[0];
    if (ip) return ip;
  }
  // Some platforms set only this, and it is not a client-appendable list.
  return headers.get("x-real-ip")?.trim() || null;
}
