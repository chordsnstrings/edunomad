import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTranslator } from "@/i18n";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export const TOTAL_STEPS = 6;

export function StepShell({
  step,
  title,
  subtitle,
  children,
  backHref,
  nextHref,
  nextLabel,
  hideProgress,
  locale = DEFAULT_LOCALE,
}: {
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backHref?: string;
  nextHref?: string;
  nextLabel?: string;
  hideProgress?: boolean;
  locale?: Locale;
}) {
  const t = getTranslator(locale);
  return (
    <div className="mx-auto min-h-screen max-w-md px-4 py-6">
      {!hideProgress && (
        <div className="mb-6">
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
            <span>{t("onboarding.step_of", { step, total: TOTAL_STEPS })}</span>
            <Link href="/" className="hover:text-navy">
              {t("common.save_and_exit")}
            </Link>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-subtle">
            <div
              className="h-full rounded-full bg-gold-500 transition-all"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      )}

      <h1 className="text-xl font-semibold text-navy">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>}

      <div className="mt-6">{children}</div>

      <div className="mt-8 flex items-center justify-between gap-3">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-ink/80 hover:bg-subtle"
          >
            <ArrowLeft className="h-4 w-4" /> {t("common.back")}
          </Link>
        ) : (
          <span />
        )}
        {nextHref && (
          <Link
            href={nextHref}
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"
          >
            {nextLabel ?? t("common.continue")} <ArrowRight className="h-4 w-4" />

          </Link>
        )}
      </div>
    </div>
  );
}
