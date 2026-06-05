import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { detectLocale } from "@/i18n/locale";
import { getActivityFeed, roleToVisibilityCode } from "@/lib/feed";

export const dynamic = "force-dynamic";

// Activity feed endpoint. Currently guarded by the admin session; per-user
// student/parent feeds attach once phone-OTP user sessions land (G009).
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const locale = await detectLocale();
  const cursor = req.nextUrl.searchParams.get("cursor");
  const code = roleToVisibilityCode(session.role) ?? "ADMIN";

  const feed = await getActivityFeed({
    roleShort: code,
    userId: session.sub,
    locale,
    cursor,
  });
  return Response.json(feed);
}
