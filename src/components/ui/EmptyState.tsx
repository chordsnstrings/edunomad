import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

/** Standard empty state: illustration + heading + body + optional CTA (CLAUDE.md §9). */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  body,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  body?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-12 text-center", className)}>
      <span
        aria-hidden
        className="grid h-16 w-16 place-items-center rounded-full bg-subtle text-navy"
      >
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </span>
      <h3 className="mt-4 text-base font-semibold text-navy">{title}</h3>
      {body && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
