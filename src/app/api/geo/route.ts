import { detectCountry } from "@/lib/geo";

export const dynamic = "force-dynamic";

/**
 * Visitor country from the edge/CDN geo headers.
 *
 * The public site is statically rendered so it can be served from a CDN; this
 * tiny dynamic endpoint is the one place that reads request headers. The client
 * calls it once (only when no country cookie is set) to localise contact numbers.
 * It returns no personal data — just an ISO-3166 alpha-2 code.
 */
export async function GET() {
  const detected = await detectCountry();
  return Response.json(
    { code: detected.code, source: detected.source },
    { headers: { "Cache-Control": "no-store" } },
  );
}
