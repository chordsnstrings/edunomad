import {
  Target,
  UserCheck,
  FolderCheck,
  ShieldCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { Card } from "@/components/ui/Card";
import { FEATURES } from "@/lib/content";

const ICONS: Record<string, LucideIcon> = {
  Target,
  UserCheck,
  FolderCheck,
  ShieldCheck,
  Users,
  Wallet,
};

export function Features() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="Why EduNomad"
        title="One platform for the whole journey"
        intro="From your first eligibility check to landing in your new city — everything in one place, with people who own the outcome."
      />
      <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = ICONS[f.icon] ?? Target;
          return (
            <Card key={f.title} className="p-6 transition-colors hover:border-navy/20">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-100 text-gold-600">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-navy">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
