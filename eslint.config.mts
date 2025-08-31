import js from "@eslint/js";
import ts from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [".next/", "node_modules/", ".vscode"],
  },
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*{js,mjs,cjs}"],
    plugins: { js },
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*{ts,mts,cts}"],
    plugins: { ts },
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: { react },
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
]);
