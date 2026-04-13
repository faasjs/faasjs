import react from '@vitejs/plugin-react'
import type { UserConfig } from 'vite-plus'

import { oxfmtConfig } from './oxfmt.ts'
import { oxlintConfig } from './oxlint.ts'
import { viteFaasJsServer } from './server.ts'

/**
 * Shared Vite Plus configuration for standard FaasJS React apps.
 *
 * This preset combines the React plugin, `viteFaasJsServer()`, workspace-safe
 * dev server defaults, `tsconfigPaths` resolution, the `virtual:faasjs-pages`
 * module used by `@faasjs/react/routing`, and the shared FaasJS format and
 * lint settings. Spread it into `defineConfig()` when the default stack
 * matches your app, then override only the fields that differ.
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
export const viteConfig = {
  staged: {
    '*': 'vp check --fix',
  },
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
} as UserConfig
