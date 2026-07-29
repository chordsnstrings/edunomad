import type { Metadata } from "next";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "You're offline",
  robots: { index: false },
};

/**
 * Offline fallback served by the service worker when a navigation fails.
 *
 * Deliberately static and personal-data free: it is written to a cache shared by
 * everyone who uses the device, so it can say what to do but never who you are.
 * Signed-in pages are still never cached — this replaces the browser's own error
 * page, which on a patchy connection is the screen a student sees most.
 */
export default function OfflinePage() {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-5">
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-subtle">
          <WifiOff className="h-6 w-6 text-navy" strokeWidth={1.75} aria-hidden />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-navy">You&apos;re offline</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Nothing you entered has been lost. Anything you were filling in is saved on this
          device and will sync as soon as you reconnect.
        </p>
        <p className="mt-4 text-sm text-muted">
          Check your mobile data or Wi-Fi, then try again.
        </p>
        {/* Deliberately a full page load, not next/link: this page is served
            from the cache with no router payload, so a client-side navigation
            would do nothing. A real request is also what we want here — it is
            the retry. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="tap mt-6 justify-center rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-700"
        >
          Try again
        </a>
      </div>
    </div>
  );
}
