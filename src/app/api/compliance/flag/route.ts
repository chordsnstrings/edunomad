import type { NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/current-user";
import { logAudit } from "@/lib/audit";
import { emit } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || !["counsellor", "counsellor_manager"].includes(session.role)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  const { studentId, guardId, message } = (await req.json().catch(() => ({}))) as {
    studentId?: string;
    guardId?: string;
    message?: string;
  };
  // Both are required: they flow into the hash-chained event/audit payloads, and
  // a missing key must not reach them (the real client always sends both).
  if (!studentId || !guardId) {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }

  // Full message content recorded for Compliance review (CLAUDE.md §G038).
  await logAudit({
    actorUserId: session.userId,
    action: "compliance.guard_overridden",
    targetType: "Communication",
    targetId: studentId ?? null,
    result: "success",
    reason: `guard ${guardId} overridden`,
    afterState: { guardId, message },
  });
  await emit({
    type: "compliance.guard_overridden",
    stage: 2,
    studentId: studentId ?? null,
    actorType: "counsellor",
    actorId: session.userId,
    visibility: { CM: true, COMP: true, EM: true },
    channels: { in_app: true, push: true },
    payload: { guardId, preview: String(message ?? "").slice(0, 160) },
  });
  return Response.json({ ok: true });
}
