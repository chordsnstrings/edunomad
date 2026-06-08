"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonClasses } from "@/components/ui/Button";

/**
 * Route error boundary (CLAUDE.md §9: tell the user their work is safe; explain
 * what to do). Branded, with a recover-in-place action.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for monitoring; never logs PII payloads.
    console.error("Route error:", error.digest ?? error.message);
  }, [error]);

  return (
    <main
      id="main"
      className="grid min-h-screen place-items-center bg-subtle px-5 py-16"
    >
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-navy">
          Something went wrong
        </h1>
        <p className="mt-3 text-muted">
          This is on us, not you — nothing you entered has been lost. Try again,
          and if it keeps happening your counsellor can help.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className={buttonClasses("primary", "md")}
          >
            Try again
          </button>
          <Link href="/" className={buttonClasses("secondary", "md")}>
            Go to homepage
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-muted">
            Reference: <span className="font-mono">{error.digest}</span>
          </p>
        )}
      </div>
    </main>
  );
}
