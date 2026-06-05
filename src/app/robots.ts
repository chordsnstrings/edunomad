import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";
import { siteUrlFrom } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  const base = siteUrlFrom(settings);
  return {
    rules: [
      // Welcome AI crawlers explicitly — part of LLM SEO.
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
