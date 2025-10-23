import { FlatCompat } from "@eslint/eslintrc";
import tailwindcssPlugin from "eslint-plugin-tailwindcss";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tailwindCssPath = __dirname + "/src/app/globals.css";

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    plugins: {
      tailwindcss: tailwindcssPlugin,
    },
    settings: {
      tailwindcss: {
        // Chemin absolu vers la feuille principale Tailwind v4 (CSS)
        cssConfigPath: tailwindCssPath,
      },
    },
    rules: {
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      // Règle d’ordre des classes Tailwind (v4)
      "tailwindcss/classnames-order": [
        "warn",
        { cssConfigPath: tailwindCssPath },
      ],
    },
  },
];

export default eslintConfig;
