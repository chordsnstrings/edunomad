import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "gold" | "navy";
}) {
  const tones = {
    neutral: "bg-subtle text-muted border-line",
    gold: "bg-gold-100 text-gold-600 border-gold/30",
    navy: "bg-navy text-white border-navy",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
