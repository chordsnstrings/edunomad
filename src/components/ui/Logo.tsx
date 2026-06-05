import { cn } from "@/lib/utils";

/** Wordmark. Uses an uploaded logo when set, otherwise a clean text mark. */
export function Logo({
  companyName,
  logoText,
  logoUrl,
  className,
  onDark = false,
}: {
  companyName: string;
  logoText?: string | null;
  logoUrl?: string | null;
  className?: string;
  onDark?: boolean;
}) {
  if (logoUrl) {
    return (
      // Admin-supplied URL from any domain — plain img avoids remote-loader config.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={companyName}
        className={cn("h-8 w-auto", className)}
      />
    );
  }
  const text = logoText || companyName;
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-lg bg-gold font-bold text-navy"
      >
        {text.charAt(0).toUpperCase()}
      </span>
      <span
        className={cn(
          "text-lg font-semibold tracking-tight",
          onDark ? "text-white" : "text-navy",
        )}
      >
        {text}
      </span>
    </span>
  );
}
