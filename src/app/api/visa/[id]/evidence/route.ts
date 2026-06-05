import { getSession } from "@/lib/auth";
import { getCurrentSession } from "@/lib/current-user";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function esc(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] ?? c));
}

// Regulator inquiry evidence packet (G163): file + audit chain + events.
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await getSession();
  const user = admin ? null : await getCurrentSession();
  if (!admin && user?.role !== "compliance") return new Response("Forbidden", { status: 403 });

  const { id } = await ctx.params;
  const vf = await prisma.visaFile.findUnique({ where: { id } });
  if (!vf) return new Response("Not found", { status: 404 });
  const student = await prisma.student.findUnique({ where: { id: vf.studentId } });
  const audits = await prisma.auditLog.findMany({ where: { targetType: "VisaFile", targetId: id }, orderBy: { seq: "asc" } });
  const events = await prisma.event.findMany({ where: { applicationId: vf.applicationId }, orderBy: { seq: "asc" } });

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Evidence packet</title>
<style>body{font-family:Arial,sans-serif;max-width:760px;margin:24px auto;padding:0 16px;color:#111}h1,h2{color:#0B1A2E}table{width:100%;border-collapse:collapse;font-size:12px}td,th{border-bottom:1px solid #eee;padding:4px;text-align:left}@media print{button{display:none}}</style></head><body>
<button onclick="print()">Print / Save PDF</button>
<h1>Evidence packet</h1>
<p><strong>Student:</strong> ${esc(student?.fullName ?? student?.phone ?? "")} · <strong>Destination:</strong> ${esc(vf.destinationCountry)}</p>
<p><strong>Sign-off:</strong> ${vf.signedOffAt ? `${esc(vf.registrationNumber ?? "")} · hash ${esc(vf.versionHash ?? "")} · ${esc(vf.signedOffAt.toISOString())}` : "not signed off"}</p>
<h2>Audit chain (${audits.length})</h2>
<table><tr><th>Action</th><th>Result</th><th>Reason</th><th>Hash</th><th>When</th></tr>
${audits.map((a) => `<tr><td>${esc(a.action)}</td><td>${esc(a.result)}</td><td>${esc(a.reason ?? "")}</td><td>${esc(a.chainHash.slice(0, 16))}…</td><td>${esc(a.createdAt.toISOString())}</td></tr>`).join("")}
</table>
<h2>Events (${events.length})</h2>
<table><tr><th>Type</th><th>Stage</th><th>Hash</th><th>When</th></tr>
${events.map((e) => `<tr><td>${esc(e.type)}</td><td>${e.stage}</td><td>${esc(e.chainHash.slice(0, 16))}…</td><td>${esc(e.createdAt.toISOString())}</td></tr>`).join("")}
</table>
<p style="color:#999;font-size:11px">Generated ${new Date().toISOString()}</p></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
