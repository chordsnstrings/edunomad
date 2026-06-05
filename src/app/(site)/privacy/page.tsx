import type { Metadata } from "next";
import { Section } from "@/components/site/Section";
import { getSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "Privacy Policy",
    description: `How ${settings.companyName} collects, uses and protects your data.`,
    alternates: { canonical: "/privacy" },
  };
}

export default async function PrivacyPage() {
  const settings = await getSettings();
  return (
    <Section className="prose-none">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-muted">
          Last updated {new Date().getFullYear()}
        </p>
        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink/80">
          <p>
            {settings.companyName} is committed to protecting your privacy. We
            collect only the information needed to guide your study-abroad
            journey — your profile, documents and communications — and we never
            sell it.
          </p>
          <h2 className="text-xl font-semibold text-navy">
            Information we collect
          </h2>
          <p>
            Contact details, academic background, uploaded documents, and
            messages you exchange with your counsellor. Documents are stored
            securely and shared only with the universities and authorities
            required for your applications.
          </p>
          <h2 className="text-xl font-semibold text-navy">Your rights</h2>
          <p>
            You can request a copy of your data or its deletion (subject to
            regulatory retention requirements for visa files) by writing to{" "}
            <a
              href={`mailto:${settings.email}`}
              className="font-medium text-navy underline"
            >
              {settings.email}
            </a>
            .
          </p>
          <p className="text-sm text-muted">
            This page is a placeholder for your full, lawyer-reviewed policy.
            Edit company details anytime in the admin panel.
          </p>
        </div>
      </div>
    </Section>
  );
}
