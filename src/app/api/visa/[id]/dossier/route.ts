import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { getLatestDocuments } from "@/lib/documents";

export const dynamic = "force-dynamic";

function esc(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] ?? c));
}

// Regulator-ready dossier as standalone, print-to-PDF HTML (G097).
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session || !["compliance", "operations_manager"].includes(session.role)) {
    return new Response("Forbidden", { status: 403 });
  }
  const { id } = await ctx.params;
  const vf = await prisma.visaFile.findUnique({ where: { id } });
  if (!vf) return new Response("Not found", { status: 404 });
  const student = await prisma.student.findUnique({ where: { id: vf.studentId } });
  const app = await prisma.application.findUnique({ where: { id: vf.applicationId } });
  const prog = app ? await prisma.programme.findUnique({ where: { id: app.programmeId }, include: { institution: true } }) : null;
  const docs = [...(await getLatestDocuments(vf.studentId)).values()];

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Visa dossier ${esc(id.slice(0, 8))}</title>
<style>body{font-family:Arial,sans-serif;color:#111;max-width:760px;margin:32px auto;padding:0 16px;line-height:1.5}
h1{color:#0B1A2E;border-bottom:2px solid #C9A84C;padding-bottom:6px}h2{color:#0B1A2E;margin-top:24px;font-size:15px}
table{width:100%;border-collapse:collapse;font-size:13px}td{padding:4px 8px;border-bottom:1px solid #eee}
.k{color:#666;width:40%}.stamp{background:#f0f7f0;border:1px solid #cbe3cb;padding:12px;border-radius:8px;margin-top:16px}
@media print{button{display:none}}</style></head><body>
<button onclick="print()">Print / Save PDF</button>
<h1>EduNomad — Visa File Dossier</h1>
<table>
<tr><td class="k">Student</td><td>${esc(student?.fullName ?? student?.phone ?? "")}</td></tr>
<tr><td class="k">Destination</td><td>${esc(vf.destinationCountry)}</td></tr>
<tr><td class="k">Institution</td><td>${esc(prog?.institution.name ?? "")}</td></tr>
<tr><td class="k">Programme</td><td>${esc(prog?.name ?? "")}</td></tr>
<tr><td class="k">Completeness</td><td>${vf.completenessPct}%</td></tr>
<tr><td class="k">Application reference</td><td>${esc(app?.referenceId ?? "")}</td></tr>
</table>
<h2>Documents (${docs.length})</h2>
<table>${docs.map((d) => `<tr><td>${esc(d.documentType)}</td><td>v${d.version} · ${esc(d.status)}</td></tr>`).join("")}</table>
${vf.signedOffAt ? `<div class="stamp"><strong>Signed off by Compliance</strong><br>Registration ${esc(vf.registrationNumber ?? "")} · version hash ${esc(vf.versionHash ?? "")}<br>${esc(vf.signedOffAt.toISOString())}</div>` : "<p><em>Not yet signed off.</em></p>"}
<p style="color:#999;font-size:11px;margin-top:24px">Generated ${new Date().toISOString()}</p>
</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
