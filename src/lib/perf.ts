// Performance budgets (G175, CLAUDE.md §10). Hard limits; CI fails on breach.
//
// Browser-side budgets (TTI, paint) are enforced by Lighthouse CI against
// lighthouse-budgets.json. Server-side budgets (feed, SOP snippet, push
// dispatch, profile save) are enforced by the synthetic test in tests/perf.test.ts
// and by `measure()` wrappers that warn in production logs on breach.

import { log } from "./log";

export const PERF_BUDGETS = {
  /** Time-to-interactive on 4G for the signup screen. */
  signupTtiMs: 3000,
  /** Profile-builder save latency. */
  profileSaveMs: 500,
  /** Activity feed update after event emit. */
  feedUpdateMs: 1000,
  /** SOP contextual snippet load. */
  sopSnippetMs: 500,
  /** Push notification dispatch after event emit. */
  pushDispatchMs: 5000,
} as const;

export type PerfMetric = keyof typeof PERF_BUDGETS;

export type Measurement<T> = { value: T; ms: number; ok: boolean; budgetMs: number };

/** Run `fn`, time it, and warn (structured log) if it exceeds the budget. */
export async function measure<T>(metric: PerfMetric, fn: () => Promise<T> | T): Promise<Measurement<T>> {
  const start = performance.now();
  const value = await fn();
  const ms = performance.now() - start;
  const budgetMs = PERF_BUDGETS[metric];
  const ok = ms <= budgetMs;
  if (!ok) log.warn("perf_budget_exceeded", { metric, ms: Math.round(ms), budgetMs });
  return { value, ms, ok, budgetMs };
}

export function withinBudget(metric: PerfMetric, ms: number): boolean {
  return ms <= PERF_BUDGETS[metric];
}
