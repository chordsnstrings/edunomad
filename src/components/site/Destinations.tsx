import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { Card } from "@/components/ui/Card";
import { DESTINATIONS } from "@/lib/content";
import { flagEmoji } from "@/lib/utils";

export function Destinations() {
  return (
    <Section id="destinations">
      <SectionHeading
        eyebrow="Where you can go"
        title="Four destinations, one application"
        intro="Build your profile once and match to programmes across these countries. We start with Canada and expand from there."
      />
      <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
        {DESTINATIONS.map((d) => (
          <Card
            key={d.code}
            className="flex flex-col p-6 transition-colors hover:border-navy/20"
          >
            <span className="text-4xl" aria-hidden>
              {flagEmoji(d.code)}
            </span>
            <h3 className="mt-4 flex items-center gap-1 text-lg font-semibold text-navy">
              {d.name}
              <ArrowUpRight className="h-4 w-4 text-gold-600" />
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{d.blurb}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
