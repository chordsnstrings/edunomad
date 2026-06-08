import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main
      id="main"
      className="grid min-h-screen place-items-center bg-subtle px-5 py-16"
    >
      <div className="w-full max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">
          404
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-navy">
          We couldn&rsquo;t find that page
        </h1>
        <p className="mt-3 text-muted">
          The link may be broken or the page may have moved. Your account and
          documents are safe.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
          <Link href="/" className={buttonClasses("primary", "md")}>
            Go to homepage
          </Link>
          <Link href="/app" className={buttonClasses("secondary", "md")}>
            Open my dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
