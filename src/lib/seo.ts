import type { Metadata } from "next";
import type { SiteSettings, CountryContact } from "@prisma/client";

export function siteUrlFrom(settings: SiteSettings): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    settings.siteUrl.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

/** Build the root Metadata object from admin-editable settings. */
export function buildMetadata(settings: SiteSettings): Metadata {
  const base = siteUrlFrom(settings);
  const title = settings.metaTitle || settings.companyName;
  const description = settings.metaDescription || settings.shortDescription;
  const keywords = settings.metaKeywords
    ? settings.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : undefined;
  // When an admin provides a custom OG image we use it; otherwise the dynamic
  // /opengraph-image route (file convention) is picked up automatically.
  const customImages = settings.ogImageUrl
    ? [{ url: settings.ogImageUrl, width: 1200, height: 630, alt: settings.companyName }]
    : undefined;

  return {
    metadataBase: new URL(base),
    title: {
      default: title,
      template: `%s · ${settings.companyName}`,
    },
    description,
    keywords,
    applicationName: settings.companyName,
    authors: [{ name: settings.companyName }],
    creator: settings.companyName,
    publisher: settings.legalName || settings.companyName,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: settings.companyName,
      title,
      description,
      url: base,
      ...(customImages ? { images: customImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: settings.twitterHandle || undefined,
      creator: settings.twitterHandle || undefined,
      ...(settings.ogImageUrl ? { images: [settings.ogImageUrl] } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: settings.faviconUrl
      ? { icon: settings.faviconUrl }
      : undefined,
    category: "education",
  };
}

function socialLinks(settings: SiteSettings): string[] {
  return [
    settings.facebookUrl,
    settings.instagramUrl,
    settings.linkedinUrl,
    settings.youtubeUrl,
    settings.twitterUrl,
    settings.tiktokUrl,
  ].filter((u): u is string => Boolean(u));
}

/**
 * Organization JSON-LD. Each enabled country contact becomes a contactPoint,
 * so search engines and assistants surface the right number per region.
 */
export function organizationJsonLd(
  settings: SiteSettings,
  contacts: CountryContact[],
) {
  const base = siteUrlFrom(settings);

  const contactPoints = [
    {
      "@type": "ContactPoint",
      telephone: settings.defaultPhone,
      contactType: "customer service",
      areaServed: settings.defaultCountryCode,
      availableLanguage: ["en"],
    },
    ...contacts.map((c) => ({
      "@type": "ContactPoint",
      telephone: c.phone,
      contactType: "customer service",
      areaServed: c.countryCode,
      availableLanguage: c.languages
        ? c.languages.split(",").map((l) => l.trim()).filter(Boolean)
        : ["en"],
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: settings.companyName,
    legalName: settings.legalName || settings.companyName,
    url: base,
    logo: settings.logoUrl || `${base}/icon.svg`,
    description: settings.shortDescription,
    foundingDate: String(settings.foundingYear),
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.addressLine,
      addressLocality: settings.city,
      addressRegion: settings.stateRegion,
      postalCode: settings.postalCode,
      addressCountry: settings.defaultCountryCode,
    },
    contactPoint: contactPoints,
    sameAs: socialLinks(settings),
  };
}

export function websiteJsonLd(settings: SiteSettings) {
  const base = siteUrlFrom(settings);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: base,
    name: settings.companyName,
    description: settings.shortDescription,
    publisher: { "@id": `${base}/#organization` },
    inLanguage: "en",
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Article + author/publisher JSON-LD for a guide page (E-E-A-T signals). */
export function articleJsonLd(opts: {
  base: string; url: string; title: string; description: string;
  datePublished?: string; dateModified?: string; companyName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    mainEntityOfPage: opts.url,
    inLanguage: "en",
    datePublished: opts.datePublished || opts.dateModified,
    dateModified: opts.dateModified,
    author: { "@type": "Organization", name: `${opts.companyName} editorial team`, url: opts.base },
    publisher: { "@id": `${opts.base}/#organization` },
    isAccessibleForFree: true,
  };
}

/** BreadcrumbList JSON-LD. */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function serviceJsonLd(settings: SiteSettings) {
  const base = siteUrlFrom(settings);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Study abroad and student visa consultancy",
    provider: { "@id": `${base}/#organization` },
    areaServed: ["CA", "GB", "AU", "MY"],
    description: settings.shortDescription,
    name: `${settings.companyName} — University & Visa Guidance`,
  };
}
