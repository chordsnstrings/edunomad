import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { SourceAttribution } from "@/components/site/SourceAttribution";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSiteContext } from "@/lib/context";
import {
  organizationJsonLd,
  websiteJsonLd,
  serviceJsonLd,
} from "@/lib/seo";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, contact, countries } = await getSiteContext();

  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd(settings, countries),
          websiteJsonLd(settings),
          serviceJsonLd(settings),
        ]}
      />
      <SourceAttribution />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} contact={contact} />
      <FloatingActions settings={settings} contact={contact} />
    </>
  );
}
