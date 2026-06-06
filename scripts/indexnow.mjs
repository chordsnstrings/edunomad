#!/usr/bin/env node
// Submit every URL in the live sitemap to IndexNow (Bing, Yandex, etc.) for
// near-instant indexing — the fastest controllable lever for early traffic.
// Bing also powers ChatGPT search, so this directly helps the AI channel.
//
// Usage (after deploy):
//   SITE_URL=https://your-domain INDEXNOW_KEY=<key> node scripts/indexnow.mjs
//
// Run it on every content update (or wire it into your deploy). It reads the
// deployed sitemap.xml, so it needs no build-time coupling to the content.

const SITE_URL = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
const KEY = process.env.INDEXNOW_KEY || "8f3c1d9a4b7e2056c9d8a1f04e6b32759a0e5d61";

if (!SITE_URL) {
  console.error("Set SITE_URL (e.g. https://edunomad.app). Aborting.");
  process.exit(1);
}

const host = new URL(SITE_URL).host;
const keyLocation = `${SITE_URL}/indexnow-key.txt`;

async function getSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`, { headers: { "User-Agent": "edunomad-indexnow" } });
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  return [...new Set(urls)];
}

async function submit(urlList) {
  // IndexNow accepts up to 10,000 URLs per request.
  for (let i = 0; i < urlList.length; i += 10000) {
    const batch = urlList.slice(i, i + 10000);
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: KEY, keyLocation, urlList: batch }),
    });
    console.log(`IndexNow: submitted ${batch.length} URLs -> HTTP ${res.status}`);
  }
}

(async () => {
  try {
    const urls = await getSitemapUrls();
    console.log(`Found ${urls.length} URLs in ${SITE_URL}/sitemap.xml`);
    await submit(urls);
    console.log("Done. (200/202 = accepted. Verify in Bing Webmaster Tools.)");
  } catch (e) {
    console.error("IndexNow submission failed:", e.message);
    process.exit(1);
  }
})();
