import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-navy-700",
  gold: "bg-gold text-navy hover:bg-gold-600",
  secondary:
    "bg-white text-navy border border-line hover:border-navy/30 hover:bg-subtle",
  ghost: "text-navy hover:bg-subtle",
};

const sizes: Record<Size, string> = {
  sm: "min-h-[40px] px-3.5 text-sm",
  md: "min-h-[44px] px-5 text-[15px]",
  lg: "min-h-[52px] px-6 text-base",
};

/** Shared class string so links and buttons look identical. */
export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props} />
  );
}
