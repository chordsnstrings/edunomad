"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Trash2, X, AlertTriangle, Sparkles } from "lucide-react";
import { lockShortlistAction } from "@/app/app/shortlist/actions";
import { useT } from "@/i18n/LocaleProvider";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { Modal } from "@/components/ui/Modal";

type Item = {
  id: string;
  programmeName: string;
  institutionName: string;
  rationale: string;
  recommendedByCounsellor: boolean;
  locked: boolean;
};

export function ShortlistManager({
  items,
  locked,
  completeness,
  lockBlockers,
  blocked,
  justLocked,
}: {
  items: Item[];
  locked: boolean;
  completeness: number;
  lockBlockers: { label: string; href: string }[];
  blocked?: boolean;
  justLocked?: boolean;
}) {
  const router = useRouter();
  const t = useT();
  const [showBlockers, setShowBlockers] = useState(!!blocked);

  async function remove(id: string) {
    await fetch(`/api/shortlist?id=${id}`, { method: "DELETE" });
    router.refresh();
  }
  async function saveRationale(id: string, rationale: string) {
    await fetch("/api/shortlist", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ applicationId: id, rationale }) });
  }

  return (
    <div>
      {justLocked && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <p className="font-semibold">Shortlist locked 🎉</p>
          <p className="mt-1">Your counsellor and the operations team will now prepare your applications. You&apos;ll get updates here.</p>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">{items.length} of 6</p>
        <p className="text-sm text-muted">Profile {completeness}%</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-line bg-white p-6 text-center text-sm text-muted">
          Nothing shortlisted yet.{" "}
          <Link href="/eligibility" className="font-semibold text-navy hover:underline">{t("app.matches.browse")}</Link>.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.id} className="rounded-xl border border-line bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-navy">{it.institutionName}</p>
                  <p className="text-sm text-ink">{it.programmeName}</p>
                  {it.recommendedByCounsellor && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-700">
                      <Sparkles className="h-3 w-3" /> Recommended by counsellor
                    </span>
                  )}
                </div>
                {!locked && (
                  <ConfirmButton
                    onConfirm={() => remove(it.id)}
                    confirmLabel={t("common.delete")}
                    cancelLabel={t("common.cancel")}
                    aria-label={t("common.delete")}
                    className="grid h-11 w-11 place-items-center text-muted hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </ConfirmButton>
                )}
              </div>
              <textarea
                defaultValue={it.rationale}
                onBlur={(e) => saveRationale(it.id, e.target.value)}
                disabled={locked}
                rows={2}
                placeholder="Why this programme? (your reasons)" aria-label="Why this programme? (your reasons)"
                className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-navy disabled:bg-subtle"
              />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        {locked ? (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-subtle py-3 text-sm font-semibold text-muted">
            <Lock className="h-4 w-4" /> Shortlist locked
          </div>
        ) : lockBlockers.length > 0 ? (
          <button type="button" onClick={() => setShowBlockers(true)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy/40 py-3 text-sm font-semibold text-white">
            <Lock className="h-4 w-4" /> {t("shortlist.lock_cta")}
          </button>
        ) : (
          <form action={lockShortlistAction}>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-3 text-sm font-semibold text-white hover:bg-navy-700">
              <Lock className="h-4 w-4" /> {t("shortlist.lock_cta")}
            </button>
          </form>
        )}
      </div>

      <Modal open={showBlockers} onClose={() => setShowBlockers(false)} title="Before you can lock">
          <div>
            <div className="mb-3 flex items-center gap-2 text-navy">
              <AlertTriangle className="h-5 w-5 text-gold-600" />
              <h2 className="text-base font-semibold">Before you can lock</h2>
              <button onClick={() => setShowBlockers(false)} aria-label={t("common.close")} className="ml-auto grid h-11 w-11 place-items-center text-muted"><X className="h-4 w-4" /></button>
            </div>
            <ul className="space-y-2">
              {lockBlockers.map((b) => (
                <li key={b.label}>
                  <Link href={b.href} className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5 text-sm text-navy hover:bg-subtle">
                    {b.label} <span className="text-muted">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
      </Modal>
    </div>
  );
}
