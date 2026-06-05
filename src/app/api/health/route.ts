import { checkHealth } from "@/lib/health";

export const dynamic = "force-dynamic";

// GET /api/health — 200 when healthy (DB reachable), 503 when degraded.
// Pinged by the uptime monitor; no auth, no PII.
export async function GET() {
  const health = await checkHealth();
  return Response.json(health, {
    status: health.status === "ok" ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
