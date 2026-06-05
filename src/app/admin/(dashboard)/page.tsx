import Link from "next/link";
import {
  Building2,
  Phone,
  Search,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { getSettings, getAllCountryContacts } from "@/lib/settings";
import { Card } from "@/components/ui/Card";
import { flagEmoji } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [settings, countries] = await Promise.all([
    getSettings(),
    getAllCountryContacts(),
  ]);
  const enabled = countries.filter((c) => c.enabled).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy">Overview</h1>
        <p className="mt-1 text-sm text-muted">
          Everything visitors see — names, numbers, SEO — is editable here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-muted">
            <Building2 className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Company
            </span>
          </div>
          <p className="mt-2 text-lg font-semibold text-navy">
            {settings.companyName}
          </p>
          <p className="text-sm text-muted">{settings.tagline}</p>
          <Link
            href="/admin/settings"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-600 hover:underline"
          >
            Edit company settings <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-muted">
            <Phone className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Default contact
            </span>
          </div>
          <p className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-navy">
            <span aria-hidden>{flagEmoji(settings.defaultCountryCode)}</span>
            {settings.defaultPhone}
          </p>
          <p className="inline-flex items-center gap-1.5 text-sm text-muted">
            <MessageCircle className="h-3.5 w-3.5" /> {settings.defaultWhatsapp}
          </p>
          <Link
            href="/admin/settings"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-600 hover:underline"
          >
            Edit default numbers <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-muted">
            <Phone className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Country numbers
            </span>
          </div>
          <p className="mt-2 text-lg font-semibold text-navy">
            {enabled} active{" "}
            <span className="text-sm font-normal text-muted">
              / {countries.length} total
            </span>
          </p>
          <p className="text-sm text-muted">
            Loaded automatically by visitor location.
          </p>
          <Link
            href="/admin/countries"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-600 hover:underline"
          >
            Manage country numbers <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-muted">
            <Search className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              SEO
            </span>
          </div>
          <p className="mt-2 line-clamp-1 text-lg font-semibold text-navy">
            {settings.metaTitle}
          </p>
          <p className="line-clamp-2 text-sm text-muted">
            {settings.metaDescription}
          </p>
          <Link
            href="/admin/settings"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-600 hover:underline"
          >
            Edit SEO &amp; LLM SEO <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </div>

      <Card className="border-gold/30 bg-gold-100/40 p-5">
        <h2 className="text-sm font-semibold text-navy">
          How country numbers work
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink/75">
          When someone visits the site, their country is detected from their IP
          (via your CDN/host). If you&apos;ve set a number for that country, it
          shows everywhere — header, contact section, and the floating WhatsApp
          &amp; call buttons. Otherwise the default numbers are used. Visitors
          can also switch region manually from the header.
        </p>
      </Card>
    </div>
  );
}
