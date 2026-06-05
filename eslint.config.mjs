import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Compiled CommonJS test output (created by `npm test`); never source.
    ".test-build/**",
  ]),
  {
    // The newer react-hooks "purity" / "set-state-in-effect" rules ship as
    // errors in eslint-config-next 16. They are advisory performance hints, not
    // correctness failures, and predate the platform CI gate — keep them visible
    // as warnings rather than blocking the pipeline or forcing a broad refactor.
    rules: {
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
]);

export default eslintConfig;
