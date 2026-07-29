/**
 * Trigger-rule condition evaluator (CLAUDE.md §8).
 *
 * SOP authors write conditions like
 *   `student.english_proficiency == 'none' OR student.english_proficiency == 'planning'`
 * and the platform is meant to evaluate them continuously so a block surfaces
 * only when it applies. Nothing evaluated them: `surfaceSopBlocks` matched on
 * `when` alone, so every trigger_rule authored for a screen appeared on that
 * screen for every record — which is exactly the noise that trains people to
 * ignore the right rail.
 *
 * Deliberately not an expression language: no function calls, no property
 * chains beyond `a.b.c`, no arithmetic. Anything it cannot parse evaluates to
 * `null` ("unknown") and the caller decides — guidance stays hidden, gates stay
 * closed. A tiny grammar a manager can read beats one they can break.
 */

export type ConditionContext = Record<string, unknown>;

const COMPARATORS = ["==", "!=", ">=", "<=", ">", "<"] as const;
type Comparator = (typeof COMPARATORS)[number];

/** `student.english_proficiency` → the value at that path, or undefined. */
function resolvePath(path: string, ctx: ConditionContext): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, ctx);
}

/** A literal is a quoted string, a number, or true/false/null. */
function parseLiteral(raw: string): { ok: true; value: unknown } | { ok: false } {
  const t = raw.trim();
  if (
    (t.startsWith("'") && t.endsWith("'") && t.length >= 2) ||
    (t.startsWith('"') && t.endsWith('"') && t.length >= 2)
  ) {
    return { ok: true, value: t.slice(1, -1) };
  }
  if (t === "true") return { ok: true, value: true };
  if (t === "false") return { ok: true, value: false };
  if (t === "null") return { ok: true, value: null };
  if (/^-?\d+(\.\d+)?$/.test(t)) return { ok: true, value: Number(t) };
  return { ok: false };
}

function compare(left: unknown, op: Comparator, right: unknown): boolean {
  switch (op) {
    case "==":
      // Loose on numeric strings only; otherwise strict, so `0 == ''` is false.
      if (typeof left === "number" && typeof right === "string") return left === Number(right);
      if (typeof left === "string" && typeof right === "number") return Number(left) === right;
      return left === right;
    case "!=":
      return !compare(left, "==", right);
    default: {
      const a = typeof left === "string" ? Number(left) : left;
      const b = typeof right === "string" ? Number(right) : right;
      if (typeof a !== "number" || typeof b !== "number" || Number.isNaN(a) || Number.isNaN(b)) {
        return false;
      }
      if (op === ">") return a > b;
      if (op === "<") return a < b;
      if (op === ">=") return a >= b;
      return a <= b;
    }
  }
}

function evalComparison(expr: string, ctx: ConditionContext): boolean | null {
  for (const op of COMPARATORS) {
    const at = expr.indexOf(op);
    if (at === -1) continue;
    // ">=" must not be read as ">" — COMPARATORS is ordered so the two-character
    // operators are tried first, but a bare ">" inside ">=" still needs guarding.
    if (op === ">" || op === "<") {
      if (expr[at + 1] === "=") continue;
    }
    const path = expr.slice(0, at).trim();
    const literal = parseLiteral(expr.slice(at + op.length));
    if (!path || !literal.ok) return null;
    if (!/^[A-Za-z_][\w.]*$/.test(path)) return null;
    const value = resolvePath(path, ctx);
    if (value === undefined) return false; // absent field cannot satisfy a condition
    return compare(value, op, literal.value);
  }
  return null;
}

/**
 * Evaluate a condition against a context.
 * Returns `null` when the expression cannot be understood — never a silent
 * `true` or `false`, because those read as a deliberate answer.
 *
 * Precedence follows the usual reading: AND binds tighter than OR.
 */
export function evaluateCondition(
  condition: string | null | undefined,
  ctx: ConditionContext,
): boolean | null {
  const expr = (condition ?? "").trim();
  if (!expr) return true; // no condition authored means "always"

  const orParts = expr.split(/\s+OR\s+/);
  let sawUnknown = false;
  for (const orPart of orParts) {
    const andParts = orPart.split(/\s+AND\s+/);
    let all = true;
    let unknownHere = false;
    for (const andPart of andParts) {
      const r = evalComparison(andPart, ctx);
      if (r === null) {
        unknownHere = true;
        all = false;
        break;
      }
      if (!r) {
        all = false;
        break;
      }
    }
    if (all) return true;
    if (unknownHere) sawUnknown = true;
  }
  // No branch was satisfied. If any branch was unparseable we cannot claim the
  // condition is false — the answer is genuinely unknown.
  return sawUnknown ? null : false;
}
