import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";
import { siteUrlFrom } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const base = siteUrlFrom(settings);
  const now = new Date();

  const routes = ["", "/privacy", "/terms"];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "yearly",
    priority: path === "" ? 1 : 0.4,
  }));
}
