import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/current-user";
import { getMyStudent } from "@/lib/student";
import { getParentStudent } from "@/lib/parent";
import { payInvoice } from "@/lib/payments";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { invoiceId, method } = (await req.json().catch(() => ({}))) as { invoiceId?: string; method?: string };
  if (!invoiceId || !method) return Response.json({ error: "missing" }, { status: 400 });

  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) return Response.json({ error: "not_found" }, { status: 404 });

  // Authorize: the student themselves, or a parent invited to that student.
  let allowed = false;
  if (session.role === "student") allowed = (await getMyStudent(session.userId))?.id === invoice.studentId;
  else if (session.role === "parent") allowed = (await getParentStudent(session.userId))?.id === invoice.studentId;
  if (!allowed) return Response.json({ error: "forbidden" }, { status: 403 });

  const res = await payInvoice(invoiceId, method, session.userId);
  return res.ok ? Response.json({ ok: true }) : Response.json({ error: res.error }, { status: 402 });
}
