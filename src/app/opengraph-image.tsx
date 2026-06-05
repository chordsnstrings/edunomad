import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/settings";

export const alt = "EduNomad — Study abroad, simplified.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function OpengraphImage() {
  const settings = await getSettings();
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B1A2E",
          padding: "72px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#C9A84C",
              color: "#0B1A2E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            {settings.companyName.charAt(0)}
          </div>
          <div style={{ fontSize: 34, fontWeight: 600 }}>
            {settings.companyName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, maxWidth: 920 }}>
            {settings.tagline}
          </div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.72)", maxWidth: 880 }}>
            {settings.shortDescription}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#C9A84C" }}>
          <div style={{ width: 40, height: 4, background: "#C9A84C" }} />
          Canada · United Kingdom · Australia · Malaysia
        </div>
      </div>
    ),
    { ...size },
  );
}
