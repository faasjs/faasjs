import { createElement } from 'react'
import { renderToString } from 'react-dom/server'

import {
  resolvePageModule,
  type PageModules,
  type RenderPageOptions,
  type RenderPageResult,
} from './auto_pages'

/**
 * Render the matched auto-discovered page into an SSR HTML string.
 *
 * @param {PageModules} pageModules - Auto-discovered page module map.
 * @param {RenderPageOptions} options - Request pathname and query.
 * @returns SSR render result, or `null` when no page matches.
 */
export async function renderPage(
  pageModules: PageModules,
  options: RenderPageOptions,
): Promise<RenderPageResult | null> {
  const page = resolvePageModule(pageModules, options.pathname, options.query)

  if (!page) return null

  const loaderResult = page.module.loader ? await page.module.loader(page.context) : {}
  const props = loaderResult.props || {}

  return {
    ...loaderResult,
    props,
    html: renderToString(createElement(page.module.default, props)),
  }
}
