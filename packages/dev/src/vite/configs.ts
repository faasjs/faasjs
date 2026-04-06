import react from '@vitejs/plugin-react'
import type { UserConfig } from 'vite-plus'

import { viteFaasJsServer } from './server.ts'
const ignorePatterns = ['**/dist/**', 'node_modules/**']

/**
 * Shared Oxfmt configuration used by FaasJS projects.
 *
 * @example
 * ```ts
 * import { defineConfig } from 'vite-plus'
 * import { oxfmtConfig } from '@faasjs/dev'
 *
 * export default defineConfig({
 *   fmt: oxfmtConfig,
 * })
 * ```
 */
export const oxfmtConfig: NonNullable<UserConfig['fmt']> = {
  ignorePatterns: [...ignorePatterns],
  semi: false,
  singleQuote: true,
  sortImports: {},
}

/**
 * Shared Oxlint configuration used by FaasJS projects.
 *
 * @example
 * ```ts
 * import { defineConfig } from 'vite-plus'
 * import { oxlintConfig } from '@faasjs/dev'
 *
 * export default defineConfig({
 *   lint: oxlintConfig,
 * })
 * ```
 */
export const oxlintConfig: NonNullable<UserConfig['lint']> = {
  ignorePatterns: [...ignorePatterns],
  plugins: [
    'typescript',
    'react',
    'react-perf',
    'node',
    'vitest',
    'oxc',
    'unicorn',
    'eslint',
    'import',
    'jsdoc',
  ],
  env: {
    builtin: true,
    node: true,
    browser: true,
  },
  settings: {
    vitest: {
      typecheck: true,
    },
  },
  options: {
    typeAware: true,
    typeCheck: true,
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'typescript/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
      },
    ],
    'react-hooks/exhaustive-deps': ['warn'],
  },
}

/**
 * Shared Vite Plus configuration for standard FaasJS React apps.
 *
 * This preset combines the React plugin, `viteFaasJsServer()`, workspace-safe
 * dev server defaults, `tsconfigPaths` resolution, and the shared FaasJS
 * format and lint settings. Spread it into `defineConfig()` when the default
 * stack matches your app, then override only the fields that differ.
 *
 * @example
 * ```ts
 * import { defineConfig } from 'vite-plus'
 * import { viteConfig } from '@faasjs/dev'
 *
 * export default defineConfig({
 *   ...viteConfig,
 * })
 * ```
 *
 * @example
 * ```ts
 * import { defineConfig } from 'vite-plus'
 * import { viteConfig } from '@faasjs/dev'
 *
 * export default defineConfig({
 *   ...viteConfig,
 *   test: {
 *     environment: 'jsdom',
 *   },
 * })
 * ```
 */
export const viteConfig: UserConfig = {
  plugins: [react(), viteFaasJsServer()],
  server: {
    host: '0.0.0.0',
    strictPort: false,
    fs: {
      strict: false,
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  fmt: oxfmtConfig,
  lint: oxlintConfig,
}
