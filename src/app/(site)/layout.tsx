import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { SourceAttribution } from "@/components/site/SourceAttribution";
import { JsonLd } from "@/components/ui/JsonLd";
import { getStaticSiteContext } from "@/lib/context";
import { VisitorContactProvider } from "@/components/site/VisitorContact";
import {
  organizationJsonLd,
  websiteJsonLd,
  serviceJsonLd,
} from "@/lib/seo";

/**
 * Public site shell. Deliberately reads NO cookies/headers, so every page beneath
 * it — including the ~687 SEO guide pages — can be statically rendered and served
 * from a CDN. The visitor's country contact is resolved client-side by
 * VisitorContactProvider instead.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, countries, defaultContact } = await getStaticSiteContext();

  return (
    <VisitorContactProvider
      defaultContact={defaultContact}
      countries={countries.map((c) => ({
        countryCode: c.countryCode,
        countryName: c.countryName,
        displayName: c.displayName,
        phone: c.phone,
        whatsapp: c.whatsapp,
      }))}
    >
      <JsonLd
        data={[
          organizationJsonLd(settings, countries),
          websiteJsonLd(settings),
          serviceJsonLd(settings),
        ]}
      />
      <SourceAttribution />
      <Header settings={settings} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} contact={defaultContact} />
      <FloatingActions settings={settings} contact={defaultContact} />
    </VisitorContactProvider>
  );
}
