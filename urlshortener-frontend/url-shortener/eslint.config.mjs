import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config} */
export default {
  files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  languageOptions: {
    globals: globals.browser,
  },
  extends: [
    ...tseslint.configs.recommended, // TypeScript recommended rules
    pluginReact.configs.flat.recommended, // React recommended rules
  ],
  rules: {
    // Suppress "Unexpected array" error
    "no-array-constructor": "off",
    
    // Allow `any` but warn about it
    "@typescript-eslint/no-explicit-any": "warn",
    
    // Allow unused variables but warn about them
    "@typescript-eslint/no-unused-vars": "warn",
  },
};
