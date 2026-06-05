import { cn } from "@/lib/utils";

/** Centered page container with the project's consistent gutters. */
export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl container-px", className)}
      {...props}
    />
  );
}
