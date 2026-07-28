import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSettings();
  return {
    name: settings.companyName,
    short_name: settings.logoText || settings.companyName,
    description: settings.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: settings.themeColor,
    // PNG is required for installability: iOS Safari ignores SVG manifest icons
    // entirely, and Android needs a raster 192/512 pair. The SVG stays as the
    // scalable "any" entry. CLAUDE.md §1.1 requires install on iOS and Android.
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
    orientation: "portrait",
    scope: "/",
    categories: ["education", "productivity"],
  };
}
