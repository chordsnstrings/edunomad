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
    icons: [
      { src: "/icon.svg", sizes: "192x192", type: "image/svg+xml", purpose: "maskable" },
      { src: "/icon.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
    orientation: "portrait",
    scope: "/",
    categories: ["education", "productivity"],
  };
}
