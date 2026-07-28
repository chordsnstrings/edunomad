/**
 * Outbound HTTP with a hard timeout.
 *
 * Every third-party call (Twilio, WhatsApp Cloud API, analytics, monitoring) used
 * a bare fetch with no timeout, so a hung or black-holed provider held the request
 * open for as long as the platform allowed — and sendOtp awaits SMS inline, so a
 * slow Twilio would stall sign-in for every user. AbortSignal.timeout aborts the
 * socket rather than merely abandoning the promise.
 */
export const DEFAULT_TIMEOUT_MS = 8_000;

export async function fetchWithTimeout(
  input: string | URL | Request,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  return fetch(input, { ...init, signal: AbortSignal.timeout(timeoutMs) });
}
