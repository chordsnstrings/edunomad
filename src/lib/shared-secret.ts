import { timingSafeEqual } from "node:crypto";

/**
 * Shared-secret auth for machine-to-machine endpoints (cron schedulers, inbound
 * webhooks).
 *
 * Fails CLOSED. These checks previously read `if (secret && header !== secret)`,
 * so an unset environment variable silently disabled authentication altogether —
 * leaving anyone able to trigger the parent SMS digest or inject inbound
 * "university" email into the operations queue. A missing secret is a
 * misconfiguration, not permission to skip the check.
 */
export function verifySharedSecret(
  req: Request,
  envName: string,
  headerName: string,
): Response | null {
  const expected = process.env[envName];
  if (!expected) {
    return Response.json(
      { error: "endpoint_not_configured" },
      { status: 503 },
    );
  }
  const provided = req.headers.get(headerName) ?? "";
  if (!safeEqual(provided, expected)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

/** Constant-time comparison so the secret can't be recovered by timing. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) {
    // Still burn a comparison so length isn't leaked by timing alone.
    timingSafeEqual(bb, bb);
    return false;
  }
  return timingSafeEqual(ab, bb);
}
