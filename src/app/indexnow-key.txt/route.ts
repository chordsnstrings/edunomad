// IndexNow ownership key file. IndexNow lets us instantly tell Bing, Yandex and
// other participating engines (Bing powers ChatGPT search) that URLs are new or
// changed — the fastest controllable path to indexing, which is the real
// bottleneck for traffic in the first days after launch.
//
// The key is PUBLIC by design (it only proves we control this host). Submit URLs
// with `scripts/indexnow.mjs`, pointing keyLocation at this file.
export const dynamic = "force-dynamic";

export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || "8f3c1d9a4b7e2056c9d8a1f04e6b32759a0e5d61";

export async function GET() {
  return new Response(INDEXNOW_KEY, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
