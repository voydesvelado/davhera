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
    // prosa-web es una SPA de Vite, no una app de Next:
    "public/prosa/**",
  ]),
  {
    // prosa-web SÍ se lintea —las reglas de react-hooks valen igual— pero las
    // reglas específicas de Next no aplican: ahí no existe `next/image` ni el
    // router de Next, así que exigirlos sería pedir algo imposible.
    files: ["prosa-web/**/*.{ts,tsx}"],
    rules: {
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
    },
  },
]);

export default eslintConfig;
