import { pageModules } from 'virtual:faasjs-pages'

import { type BootstrapAutoPagesOptions, type ResolvedPage } from './auto_pages'
import { bootstrapAutoPages } from './auto_pages_client_runtime'

/**
 * Browser bootstrap options when using `@faasjs/react/auto-pages/client`.
 */
export type AutoPagesClientOptions = Omit<BootstrapAutoPagesOptions, 'pageModules'>

/**
 * Bootstrap the current browser page using Vite-discovered `src/pages` modules.
 *
 * @param {AutoPagesClientOptions} [options] - Optional browser overrides such as a custom root element.
 * @returns The resolved page module and context for the mounted page.
 */
export function bootstrap(options: AutoPagesClientOptions = {}): Promise<ResolvedPage> {
  return bootstrapAutoPages({
    ...options,
    pageModules,
  })
}
