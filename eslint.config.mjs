// eslint.config.mjs
// ESLint 9 flat config — required because `next lint` is removed in Next.js 16.
// Run linting with: npm run lint  (which calls `eslint .`)
//
// FlatCompat bridges the old "extends" format so the existing next/core-web-vitals
// ruleset works without rewriting everything.

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [...compat.extends("next/core-web-vitals")];

export default eslintConfig;
