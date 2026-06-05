import { getSession } from "@/lib/auth";
import { getCurrentSession } from "@/lib/current-user";
import { exportAuditCsv } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getSession();
  const user = admin ? null : await getCurrentSession();
  if (!admin && user?.role !== "compliance") return new Response("Forbidden", { status: 403 });
  const csv = await exportAuditCsv();
  return new Response(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="audit-log-${new Date().toISOString().slice(0, 10)}.csv"` },
  });
}
