import react from '@vitejs/plugin-react'
import type { UserConfig } from 'vite-plus'

import { OxfmtConfig } from './oxfmt.ts'
import { OxlintConfig } from './oxlint.ts'
import { viteFaasJsServer } from './server.ts'

/**
 * Shared Vite Plus configuration for standard FaasJS React apps.
 *
 * `ViteConfig` is intentionally named as a configuration object, not a plugin:
 * spread it into `defineConfig()` when you want the default FaasJS React development
 * stack. The preset combines staged checks, the React plugin, `viteFaasJsServer()`,
 * workspace-safe dev server defaults, `tsconfigPaths` resolution, and the shared
 * FaasJS format and lint settings. Override individual fields after spreading
 * the object when an app needs different defaults.
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
  /** Runs `vp check --fix` for staged files. */
  staged: NonNullable<UserConfig['staged']>
  /** Registers React support and the in-process FaasJS POST server plugin. */
  plugins: NonNullable<UserConfig['plugins']>
  /** Binds to all interfaces, allows port fallback, and disables strict filesystem serving. */
  server: NonNullable<UserConfig['server']>
  /** Enables Vite Plus `tsconfigPaths` resolution. */
  resolve: NonNullable<UserConfig['resolve']>
  /** Applies the shared FaasJS Oxfmt defaults. */
  fmt: NonNullable<UserConfig['fmt']>
  /** Applies the shared FaasJS Oxlint defaults. */
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
