import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores([
    'dist/',
    '.astro/',
    'node_modules/',
    'playwright-report/',
    'test-results/',
  ]),
  tseslint.configs.recommended,
  eslintPluginAstro.configs.recommended,
);
