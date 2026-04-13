import { createElement } from 'react'
import { createRoot } from 'react-dom/client'

import {
  resolvePageModule,
  resolvePageQuery,
  type BootstrapRoutingOptions,
  type ResolvedPage,
  type RoutingWindow,
} from './routing'

function getDefaultWindow(): RoutingWindow | undefined {
  return typeof window === 'undefined' ? undefined : window
}

function getDefaultDocument(): Document | undefined {
  return typeof document === 'undefined' ? undefined : document
}

/**
 * Resolve the current browser route and mount it.
 *
 * @param {BootstrapRoutingOptions} options - Browser bootstrap options.
 * @returns The resolved page module and context for the mounted page.
 */
export async function bootstrapRouting(options: BootstrapRoutingOptions): Promise<ResolvedPage> {
  const currentWindow = options.window ?? getDefaultWindow()
  const currentDocument = options.document ?? currentWindow?.document ?? getDefaultDocument()
  const pathname = options.pathname ?? currentWindow?.location.pathname
  const search = options.search ?? currentWindow?.location.search ?? ''
  const rootId = options.rootId || 'root'
  const root = options.root ?? currentDocument?.getElementById(rootId)

  if (!pathname) throw Error('Missing pathname for routing bootstrap.')
  if (!root) throw Error(`Missing root element #${rootId}.`)

  const page = resolvePageModule(options.pageModules, pathname, resolvePageQuery(search))

  if (!page) throw Error(`Cannot resolve page for ${pathname}`)

  const element = createElement(page.module.default)

  if (root.innerHTML.trim()) root.innerHTML = ''

  createRoot(root).render(element)

  return page
}

/**
 * @deprecated Use {@link bootstrapRouting} instead.
 */
export const bootstrapAutoPages = bootstrapRouting
