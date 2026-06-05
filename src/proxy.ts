import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";
import { apiLimit } from "@/lib/ratelimit";

// Edge guard (Next 16 "proxy", formerly middleware). Two jobs:
//   1. Rate-limit /api/* at 100 req/min per session (G182).
//   2. Gate the /admin area on a valid admin session.
// The admin layout and every server action re-check auth — never trust one layer.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. General API rate limit: 100 / min / session (fail-open).
  if (pathname.startsWith("/api/")) {
    const key =
      req.cookies.get("en_session")?.value ||
      req.cookies.get("en_admin")?.value ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "anon";
    const r = apiLimit(key);
    if (!r.ok) {
      const retryAfter = Math.ceil(r.retryAfterMs / 1000);
      return NextResponse.json(
        { error: "rate_limited", retryAfter },
        { status: 429, headers: { "Retry-After": String(retryAfter), "X-RateLimit-Limit": String(r.limit) } },
      );
    }
    return NextResponse.next();
  }

  // 2. Admin guard.
  if (pathname.startsWith("/admin/login")) return NextResponse.next();
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/:path*"],
};
