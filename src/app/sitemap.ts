import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";
import { siteUrlFrom } from "@/lib/seo";
import { ARTICLES } from "@/content/seo/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const base = siteUrlFrom(settings);
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/editorial-standards`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Country pillars rank higher; everything else gets solid, even priority.
  const guides: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${base}/guides/${a.slug}`,
    lastModified: a.updated ? new Date(a.updated) : now,
    changeFrequency: "monthly" as const,
    priority: a.category === "country" ? 0.9 : a.category === "visa" || a.category === "funds" ? 0.8 : 0.7,
  }));

  return [...core, ...guides];
}
