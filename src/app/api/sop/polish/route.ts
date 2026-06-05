import type { NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/current-user";
import { polishSop } from "@/lib/sop-polish";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || !["operations_team", "operations_manager", "counsellor", "counsellor_manager"].includes(session.role)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  const { content, destination } = (await req.json().catch(() => ({}))) as { content?: string; destination?: string };
  const res = await polishSop(String(content ?? ""), String(destination ?? "CA"));
  return Response.json(res);
}
