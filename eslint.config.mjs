import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["build/**", "coverage/**", ".github/**"] },
  js.configs.recommended,
  { files: ["**/*.{js,jsx,mjs,cjs}"], languageOptions: { ecmaVersion: "latest", parserOptions: { ecmaFeatures: { jsx: true } }, globals: { ...globals.browser, ...globals.node, ...globals.jest } }, rules: { "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z]" }] } },
  { files: ["src/**/*.{js,jsx}"], plugins: { "react-hooks": reactHooks }, rules: { "react-hooks/rules-of-hooks": "error", "react-hooks/exhaustive-deps": "error" } },
];
