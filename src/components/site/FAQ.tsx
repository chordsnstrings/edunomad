import { Plus } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { FAQS } from "@/lib/content";

/** Accordion with native <details> — accessible and needs zero JS. */
export function FAQ() {
  return (
    <Section id="faq" className="bg-subtle">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          eyebrow="Questions"
          title="Answers, before you ask"
          intro="Still unsure? Tap WhatsApp below — a local counsellor will reply."
        />
        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {FAQS.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-[15px] font-semibold text-navy [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="h-5 w-5 shrink-0 text-gold-600 transition-transform group-open:rotate-45" />
              </summary>
              <div className="px-5 pb-5 text-sm leading-relaxed text-muted">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
