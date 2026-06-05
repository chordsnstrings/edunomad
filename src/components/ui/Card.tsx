import { cn } from "@/lib/utils";

/** 1px-rule card — flat, no drop shadow (CLAUDE.md §9). */
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-line bg-white",
        className,
      )}
      {...props}
    />
  );
}
