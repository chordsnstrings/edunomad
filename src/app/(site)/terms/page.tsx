import type { Metadata } from "next";
import { Section } from "@/components/site/Section";
import { getSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "Terms of Service",
    description: `The terms that govern your use of ${settings.companyName}.`,
    alternates: { canonical: "/terms" },
  };
}

export default async function TermsPage() {
  const settings = await getSettings();
  return (
    <Section>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-muted">
          Last updated {new Date().getFullYear()}
        </p>
        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink/80">
          <p>
            By using {settings.companyName}, you agree to provide accurate
            information and to use the platform only for your own study-abroad
            applications.
          </p>
          <h2 className="text-xl font-semibold text-navy">No guarantees</h2>
          <p>
            We guide and support your applications, but admission, scholarship
            and visa decisions are made solely by universities and government
            authorities. {settings.companyName} never guarantees an outcome.
          </p>
          <h2 className="text-xl font-semibold text-navy">Payments</h2>
          <p>
            All fees are handled through secure in-platform payments. Refund
            terms are shown at the point of each payment.
          </p>
          <p className="text-sm text-muted">
            This page is a placeholder for your full, lawyer-reviewed terms.
            Edit company details anytime in the admin panel.
          </p>
        </div>
      </div>
    </Section>
  );
}
