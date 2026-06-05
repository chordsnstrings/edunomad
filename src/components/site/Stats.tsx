import { Container } from "@/components/ui/Container";
import { STATS } from "@/lib/content";

export function Stats() {
  return (
    <section className="border-y border-line bg-subtle">
      <Container className="grid grid-cols-2 gap-px overflow-hidden rounded-none lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="px-2 py-8 text-center sm:py-10">
            <div className="text-3xl font-semibold text-navy sm:text-4xl">
              {s.value}
            </div>
            <div className="mt-1.5 text-sm text-muted">{s.label}</div>
          </div>
        ))}
      </Container>
    </section>
  );
}
