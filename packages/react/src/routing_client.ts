import { pageModules } from 'virtual:faasjs-pages'

import { type BootstrapRoutingOptions, type ResolvedPage } from './routing'
import { bootstrapRouting } from './routing_client_runtime'

/**
 * Browser bootstrap options when using `@faasjs/react/routing/client`.
 */
export type RoutingClientOptions = Omit<BootstrapRoutingOptions, 'pageModules'>

/**
 * @deprecated Use {@link RoutingClientOptions} instead.
 */
export type AutoPagesClientOptions = RoutingClientOptions

/**
 * Bootstrap the current browser page using Vite-discovered `src/pages` modules.
 *
 * @param {RoutingClientOptions} [options] - Optional browser overrides such as a custom root element.
 * @returns The resolved page module and context for the mounted page.
 */
export function bootstrap(options: RoutingClientOptions = {}): Promise<ResolvedPage> {
  return bootstrapRouting({
    ...options,
    pageModules,
  })
}
