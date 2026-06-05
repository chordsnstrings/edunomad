"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { saveSettingsAction, type FormState } from "@/app/admin/actions";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { COUNTRIES } from "@/lib/countries";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/settings";

type Errors = Record<string, string> | undefined;

const TABS = [
  { id: "general", label: "General" },
  { id: "contact", label: "Contact" },
  { id: "social", label: "Social" },
  { id: "seo", label: "SEO" },
  { id: "analytics", label: "Analytics" },
  { id: "display", label: "Display" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveSettingsAction,
    {},
  );
  const [tab, setTab] = useState<TabId>("general");
  const errors = state.fieldErrors;

  return (
    <form action={action} className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Company settings</h1>
          <p className="mt-1 text-sm text-muted">
            Edit anything your visitors see. Changes go live immediately.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-line bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "bg-navy text-white"
                : "text-ink/70 hover:bg-subtle",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── General ── */}
      <Panel active={tab === "general"}>
        <Grid>
          <T name="companyName" label="Company name" required def={settings.companyName} errors={errors} />
          <T name="legalName" label="Legal name" def={settings.legalName} errors={errors} />
          <T name="logoText" label="Logo text" hint="Shown when no logo image is set." def={settings.logoText} errors={errors} />
          <T name="tagline" label="Tagline" def={settings.tagline} errors={errors} />
          <TA name="shortDescription" label="Short description" full hint="Used in the hero and as an SEO fallback. Keep it tight." def={settings.shortDescription} errors={errors} />
          <TA name="longDescription" label="Long description / about" full hint="Used on the site and in /llms-full.txt for AI assistants." def={settings.longDescription} errors={errors} />
          <T name="logoUrl" label="Logo image URL" hint="Optional. Overrides the text logo." def={settings.logoUrl ?? ""} errors={errors} />
          <T name="faviconUrl" label="Favicon URL" def={settings.faviconUrl ?? ""} errors={errors} />
          <T name="foundingYear" label="Founding year" type="number" def={String(settings.foundingYear)} errors={errors} />
        </Grid>
      </Panel>

      {/* ── Contact ── */}
      <Panel active={tab === "contact"}>
        <Grid>
          <Field label="Default country" hint="Used when a visitor's country has no specific number.">
            <Select name="defaultCountryCode" defaultValue={settings.defaultCountryCode}>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </Select>
          </Field>
          <T name="businessHours" label="Business hours" def={settings.businessHours} errors={errors} />
          <T name="defaultPhone" label="Default phone" required def={settings.defaultPhone} errors={errors} />
          <T name="defaultWhatsapp" label="Default WhatsApp" required def={settings.defaultWhatsapp} errors={errors} />
          <T name="email" label="Email" required type="email" def={settings.email} errors={errors} />
          <T name="supportEmail" label="Support email" type="email" def={settings.supportEmail} errors={errors} />
          <T name="addressLine" label="Address line" def={settings.addressLine} errors={errors} />
          <T name="city" label="City" def={settings.city} errors={errors} />
          <T name="stateRegion" label="State / region" def={settings.stateRegion} errors={errors} />
          <T name="postalCode" label="Postal code" def={settings.postalCode} errors={errors} />
          <T name="country" label="Country (display)" def={settings.country} errors={errors} />
          <T name="mapUrl" label="Map URL" def={settings.mapUrl ?? ""} errors={errors} />
        </Grid>
      </Panel>

      {/* ── Social ── */}
      <Panel active={tab === "social"}>
        <Grid>
          <T name="facebookUrl" label="Facebook URL" def={settings.facebookUrl ?? ""} errors={errors} />
          <T name="instagramUrl" label="Instagram URL" def={settings.instagramUrl ?? ""} errors={errors} />
          <T name="linkedinUrl" label="LinkedIn URL" def={settings.linkedinUrl ?? ""} errors={errors} />
          <T name="youtubeUrl" label="YouTube URL" def={settings.youtubeUrl ?? ""} errors={errors} />
          <T name="twitterUrl" label="X / Twitter URL" def={settings.twitterUrl ?? ""} errors={errors} />
          <T name="tiktokUrl" label="TikTok URL" def={settings.tiktokUrl ?? ""} errors={errors} />
          <T name="whatsappCommunityUrl" label="WhatsApp community URL" def={settings.whatsappCommunityUrl ?? ""} errors={errors} />
        </Grid>
      </Panel>

      {/* ── SEO ── */}
      <Panel active={tab === "seo"}>
        <Grid>
          <T name="siteUrl" label="Canonical site URL" required hint="e.g. https://edunomad.app" def={settings.siteUrl} errors={errors} />
          <ColorField def={settings.themeColor} error={errors?.themeColor} />
          <T name="metaTitle" label="Meta title" full hint="Aim for under ~60 characters." def={settings.metaTitle} errors={errors} />
          <TA name="metaDescription" label="Meta description" full hint="Aim for under ~160 characters." def={settings.metaDescription} errors={errors} />
          <T name="metaKeywords" label="Meta keywords" full hint="Comma-separated." def={settings.metaKeywords} errors={errors} />
          <T name="ogImageUrl" label="Social share image URL" hint="Leave blank to use the auto-generated branded image." def={settings.ogImageUrl ?? ""} errors={errors} />
          <T name="twitterHandle" label="X / Twitter handle" hint="e.g. @edunomad" def={settings.twitterHandle} errors={errors} />
          <TA name="llmsSummary" label="AI / LLM summary" full hint="Shown at /llms.txt so AI assistants describe you accurately (LLM SEO)." def={settings.llmsSummary} errors={errors} />
        </Grid>
      </Panel>

      {/* ── Analytics ── */}
      <Panel active={tab === "analytics"}>
        <Grid>
          <T name="gaMeasurementId" label="Google Analytics 4 ID" hint="e.g. G-XXXXXXXXXX" def={settings.gaMeasurementId ?? ""} errors={errors} />
          <T name="gtmId" label="Google Tag Manager ID" hint="e.g. GTM-XXXXXXX" def={settings.gtmId ?? ""} errors={errors} />
          <T name="plausibleDomain" label="Plausible domain" hint="e.g. edunomad.app" def={settings.plausibleDomain ?? ""} errors={errors} />
          <T name="metaPixelId" label="Meta Pixel ID" def={settings.metaPixelId ?? ""} errors={errors} />
        </Grid>
      </Panel>

      {/* ── Display ── */}
      <Panel active={tab === "display"}>
        <Card className="divide-y divide-line">
          <div className="p-5">
            <Toggle name="showFloatingWhatsapp" label="Floating WhatsApp button" hint="Show the sticky WhatsApp button on every page." defaultChecked={settings.showFloatingWhatsapp} />
          </div>
          <div className="p-5">
            <Toggle name="showFloatingCall" label="Floating call button" hint="Show the sticky call button on every page." defaultChecked={settings.showFloatingCall} />
          </div>
          <div className="p-5">
            <Toggle name="geoEnabled" label="Location-based numbers" hint="Automatically load the right number for each visitor's country." defaultChecked={settings.geoEnabled} />
          </div>
        </Card>
      </Panel>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 z-10 -mx-1 flex items-center justify-between gap-3 rounded-xl border border-line bg-white/95 px-4 py-3 backdrop-blur">
        <div aria-live="polite" className="min-w-0 text-sm">
          {state.ok && (
            <span className="inline-flex items-center gap-1.5 font-medium text-green-700">
              <CheckCircle2 className="h-4 w-4" /> {state.message ?? "Saved."}
            </span>
          )}
          {state.error && (
            <span className="inline-flex items-center gap-1.5 font-medium text-red-700">
              <AlertCircle className="h-4 w-4" /> {state.error}
            </span>
          )}
        </div>
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

// ── Internal helpers ────────────────────────────────────────────────
function Panel({ active, children }: { active: boolean; children: React.ReactNode }) {
  return <div hidden={!active}>{children}</div>;
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

function T({
  name,
  label,
  def,
  hint,
  required,
  type = "text",
  full,
  errors,
}: {
  name: string;
  label: string;
  def?: string;
  hint?: string;
  required?: boolean;
  type?: string;
  full?: boolean;
  errors: Errors;
}) {
  const err = errors?.[name];
  return (
    <Field label={label} hint={hint} htmlFor={name} required={required} className={full ? "sm:col-span-2" : undefined}>
      <Input id={name} name={name} type={type} defaultValue={def} aria-invalid={err ? true : undefined} className={err ? "border-red-400" : undefined} />
      {err && <p className="text-xs font-medium text-red-600">{err}</p>}
    </Field>
  );
}

function TA({
  name,
  label,
  def,
  hint,
  full,
  errors,
}: {
  name: string;
  label: string;
  def?: string;
  hint?: string;
  full?: boolean;
  errors: Errors;
}) {
  const err = errors?.[name];
  return (
    <Field label={label} hint={hint} htmlFor={name} className={full ? "sm:col-span-2" : undefined}>
      <Textarea id={name} name={name} defaultValue={def} className={err ? "border-red-400" : undefined} />
      {err && <p className="text-xs font-medium text-red-600">{err}</p>}
    </Field>
  );
}

function ColorField({ def, error }: { def: string; error?: string }) {
  const [value, setValue] = useState(def);
  return (
    <Field label="Theme colour" hint="Used for the browser UI and PWA." htmlFor="themeColor">
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label="Pick theme colour"
          value={/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value) ? value : "#0B1A2E"}
          onChange={(e) => setValue(e.target.value)}
          className="h-11 w-12 shrink-0 cursor-pointer rounded-lg border border-line bg-white p-1"
        />
        <Input id="themeColor" name="themeColor" value={value} onChange={(e) => setValue(e.target.value)} className={error ? "border-red-400" : undefined} />
      </div>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </Field>
  );
}
