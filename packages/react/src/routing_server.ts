import { pageModules } from 'virtual:faasjs-pages'

import type { RenderPageOptions, RenderPageResult } from './routing'
import { renderPage as renderRoutingPage } from './routing_server_runtime'

/**
 * Render the matched Vite-discovered `src/pages` module for React SSR.
 *
 * @param {RenderPageOptions} options - SSR request pathname and query.
 * @returns SSR render result, or `null` when no page matches.
 */
export function renderPage(options: RenderPageOptions): Promise<RenderPageResult | null> {
  return renderRoutingPage(pageModules, options)
}
