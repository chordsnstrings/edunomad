import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function Section({
  id,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-28", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center,
  onDark,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  center?: boolean;
  onDark?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <p
          className={cn(
            "mb-2.5 text-sm font-semibold uppercase tracking-wider",
            onDark ? "text-gold" : "text-gold-600",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-semibold sm:text-4xl",
          onDark ? "text-white" : "text-navy",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            onDark ? "text-white/70" : "text-muted",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
