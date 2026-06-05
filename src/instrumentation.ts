// Next.js instrumentation hook (G177). Server-side errors (route handlers,
// server components, server actions) flow here with stack traces; we capture
// them with non-PII context and route the alert by severity.

import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  const { captureException } = await import("./lib/monitoring");
  await captureException(err, {
    severity: "error",
    tags: {
      route: context?.routePath ?? "",
      routeType: context?.routeType ?? "",
      method: request?.method ?? "",
    },
  });
};
