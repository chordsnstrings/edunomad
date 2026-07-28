import type { Metadata } from "next";
import { Check, FileText } from "lucide-react";
import { requireStudent } from "@/lib/require-student";
import { prisma } from "@/lib/db";
import { EmptyState } from "@/components/ui/EmptyState";
import { OfferActions } from "@/components/app/OfferActions";
import { getTranslator } from "@/i18n";
import { getUserLocale } from "@/i18n/server";

export const metadata: Metadata = { title: "Offers", robots: { index: false } };
export const dynamic = "force-dynamic";

const LABEL: Record<string, string> = {
  offer_conditional: "Conditional offer",
  offer_unconditional: "Unconditional offer",
  accepted: "Accepted",
  declined: "Declined",
  rejected: "Not offered",
};

export default async function OffersPage() {
  const { student } = await requireStudent();
  const t = getTranslator(await getUserLocale());
  const apps = await prisma.application.findMany({ where: { studentId: student.id, decisionStatus: { not: null } }, orderBy: { decisionAt: "desc" } });

  // One query for every offered programme instead of one per row.
  const programmes = await prisma.programme.findMany({
    where: { id: { in: apps.map((a) => a.programmeId) } },
    include: { institution: { select: { name: true } } },
  });
  const progBy = new Map(programmes.map((p) => [p.id, p]));

  const rows = apps.map((a) => {
    const prog = progBy.get(a.programmeId);
    return { app: a, name: prog?.name ?? "Programme", institution: prog?.institution.name ?? "", conditions: (a.conditions as string[] | null) ?? [] };
  });

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold text-navy">{t("app.nav.offers")}</h1>
      {rows.length === 0 ? (
        <EmptyState title="No decisions yet" body={t("empty.no_offers")} />
      ) : (
        <ul className="space-y-3">
          {rows.map(({ app, name, institution, conditions }) => {
            const decided = app.decisionStatus === "accepted" || app.decisionStatus === "declined";
            const isOffer = app.decisionStatus?.startsWith("offer");
            return (
              <li key={app.id} className="rounded-2xl border border-line bg-white p-4">
                <p className="text-sm font-semibold text-navy">{institution}</p>
                <p className="text-sm text-ink">{name}</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${decided ? "bg-subtle text-muted" : "bg-gold-100 text-gold-700"}`}>{LABEL[app.decisionStatus ?? ""] ?? app.decisionStatus}</span>

                {app.offerUrl && (
                  <a href={app.offerUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm text-navy underline">
                    <FileText className="h-4 w-4" /> View offer letter
                  </a>
                )}

                {conditions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-navy">{t("app.offers.conditions")}</p>
                    <ul className="mt-1 space-y-1">
                      {conditions.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-ink"><Check className="mt-0.5 h-3.5 w-3.5 text-muted" /> {c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {isOffer && !decided && <OfferActions applicationId={app.id} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
