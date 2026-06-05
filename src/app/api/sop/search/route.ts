import type { NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/current-user";
import { getSession } from "@/lib/auth";
import { searchSops } from "@/lib/sop-runtime";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ok = (await getCurrentSession()) || (await getSession());
  if (!ok) return Response.json({ error: "unauthorized" }, { status: 401 });
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const results = (await searchSops(q)).map((a) => ({ slug: a.slug, title: a.title, category: a.category }));
  return Response.json({ results });
}
