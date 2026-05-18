import react from '@vitejs/plugin-react'
import type { UserConfig } from 'vite-plus'

import { OxfmtConfig } from './oxfmt.ts'
import { OxlintConfig } from './oxlint.ts'
import { viteFaasJsServer } from './server.ts'

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
 * import { ViteConfig } from '@faasjs/dev'
 *
 * export default defineConfig({
 *   ...ViteConfig,
 * })
 * ```
 *
 * @example
 * ```ts
 * import { defineConfig } from 'vite-plus'
 * import { ViteConfig } from '@faasjs/dev'
 *
 * export default defineConfig({
 *   ...ViteConfig,
 *   test: {
 *     environment: 'jsdom',
 *   },
 * })
 * ```
 */
export const ViteConfig: {
  staged: NonNullable<UserConfig['staged']>
  plugins: NonNullable<UserConfig['plugins']>
  server: NonNullable<UserConfig['server']>
  resolve: NonNullable<UserConfig['resolve']>
  fmt: NonNullable<UserConfig['fmt']>
  lint: NonNullable<UserConfig['lint']>
} = {
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
  fmt: OxfmtConfig,
  lint: OxlintConfig,
}
