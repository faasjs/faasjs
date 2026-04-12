import { fileURLToPath } from 'node:url'

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

/**
 * Options for {@link createReactRoutingViteConfig}.
 */
export type ReactRoutingViteConfigOptions = {
  /**
   * SSR output directory used for the built `server-entry` bundle.
   *
   * @default 'dist-server'
   */
  ssrOutDir?: string
  /**
   * Optional override for the React SSR server entry module.
   *
   * Defaults to `@faasjs/react/routing/server-entry`.
   */
  serverEntry?: string
}

/**
 * @deprecated Use {@link ReactRoutingViteConfigOptions} instead.
 */
export type ReactAutoPagesViteConfigOptions = ReactRoutingViteConfigOptions

function resolveReactRoutingServerEntry(serverEntry?: string): string {
  if (serverEntry) return serverEntry

  return fileURLToPath(import.meta.resolve('@faasjs/react/routing/server-entry'))
}

/**
 * Create the shared Vite config for React SSR apps that use file-based routing.
 *
 * This extends {@link viteConfig} with a second SSR build environment so a plain
 * `vp build` emits both the client bundle and the React SSR `dist-server`
 * bundle. Use it when the app relies on `@faasjs/react/routing` and should
 * not keep a local SSR build script.
 *
 * @param {ReactRoutingViteConfigOptions} [options] - Optional SSR build overrides.
 * @returns {UserConfig} Vite config with both client and SSR builds configured.
 *
 * @example
 * ```ts
 * import { defineConfig } from 'vite-plus'
 * import { createReactRoutingViteConfig } from '@faasjs/dev'
 *
 * export default defineConfig(createReactRoutingViteConfig())
 * ```
 */
export function createReactRoutingViteConfig(
  options: ReactRoutingViteConfigOptions = {},
): UserConfig {
  return {
    ...viteConfig,
    environments: {
      ssr: {
        build: {
          ssr: resolveReactRoutingServerEntry(options.serverEntry),
          outDir: options.ssrOutDir || 'dist-server',
        },
      },
    },
    builder: {
      async buildApp(builder) {
        await builder.build(builder.environments.client)
        await builder.build(builder.environments.ssr)
      },
    },
  }
}

/**
 * @deprecated Use {@link createReactRoutingViteConfig} instead.
 */
export function createReactAutoPagesViteConfig(
  options: ReactAutoPagesViteConfigOptions = {},
): UserConfig {
  return createReactRoutingViteConfig(options)
}
