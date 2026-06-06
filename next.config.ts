import type { NextConfig } from "next";

// Security response headers (G183 TLS/HSTS, plus baseline hardening).
// HSTS is only emitted in production so local HTTP dev isn't pinned to HTTPS.
// HTTP→HTTPS redirect + certificate issuance/renewal are handled at the edge
// (platform-managed TLS / Let's Encrypt) — see docs/cc/tls.md.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Camera allowed for document capture (CLAUDE.md §9); mic/geo denied.
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Self-contained server bundle for Docker / DigitalOcean (lean runtime image).
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    const headers = [...securityHeaders];
    if (process.env.NODE_ENV === "production") {
      headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
    }
    return [{ source: "/:path*", headers }];
  },
};

export default nextConfig;
