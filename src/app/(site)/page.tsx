import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Features } from "@/components/site/Features";
import { Journey } from "@/components/site/Journey";
import { Destinations } from "@/components/site/Destinations";
import { FAQ } from "@/components/site/FAQ";
import { ContactSection } from "@/components/site/ContactSection";
import { CTA } from "@/components/site/CTA";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSiteContext } from "@/lib/context";
import { faqJsonLd } from "@/lib/seo";
import { FAQS } from "@/lib/content";

export default async function HomePage() {
  const { settings, contact } = await getSiteContext();

  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <Hero settings={settings} contact={contact} />
      <Stats />
      <Features />
      <Journey />
      <Destinations />
      <FAQ />
      <ContactSection settings={settings} contact={contact} />
      <CTA />
    </>
  );
}
