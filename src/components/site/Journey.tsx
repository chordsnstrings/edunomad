import { Section, SectionHeading } from "./Section";
import { JOURNEY } from "@/lib/content";

export function Journey() {
  return (
    <Section id="journey" className="bg-subtle">
      <SectionHeading
        eyebrow="The 9-stage journey"
        title="Always know exactly where you are"
        intro="Your status is never a mystery. Each stage updates in real time for you and your parents, in your language."
      />
      <ol className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
        {JOURNEY.map((s) => (
          <li
            key={s.stage}
            className="flex items-center gap-4 rounded-xl border border-line bg-white p-4"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy text-sm font-semibold text-white">
              {s.stage}
            </span>
            <span className="text-[15px] font-medium text-navy">{s.name}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
