import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '.vitest/**'],
  },
  {
    files: ['**/*.{js,mjs, cjs, ts, mts, cts}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
  },
  {
    files: ['eslint.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  eslintConfigPrettier,
]);
