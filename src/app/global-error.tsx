"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for errors in the root layout itself. Renders outside
 * the root layout (no global stylesheet), so styles are inlined.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          background: "#f6f7f9",
          color: "#14181f",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <h1 style={{ color: "#0b1a2e", fontSize: "1.5rem", margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#58616f", marginTop: "0.75rem" }}>
            This is on us, not you — nothing you entered has been lost. Please
            try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: "1.5rem",
              minHeight: 44,
              padding: "0 1.25rem",
              borderRadius: 10,
              border: "none",
              background: "#0b1a2e",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
