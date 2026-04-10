import { createElement } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

import {
  resolvePageModule,
  resolvePageQuery,
  type AutoPagesWindow,
  type BootstrapAutoPagesOptions,
  type ResolvedPage,
} from './auto_pages'

function getDefaultWindow(): AutoPagesWindow | undefined {
  return typeof window === 'undefined' ? undefined : (window as AutoPagesWindow)
}

function getDefaultDocument(): Document | undefined {
  return typeof document === 'undefined' ? undefined : document
}

async function resolvePageProps(page: ResolvedPage): Promise<Record<string, unknown>> {
  const loaderResult = page.module.loader ? await page.module.loader(page.context) : {}

  return loaderResult.props || {}
}

/**
 * Resolve the current browser page, load props when SSR payload is missing, and mount it.
 *
 * @param {BootstrapAutoPagesOptions} options - Browser bootstrap options.
 * @returns The resolved page module and context for the mounted page.
 */
export async function bootstrapAutoPages(
  options: BootstrapAutoPagesOptions,
): Promise<ResolvedPage> {
  const currentWindow = options.window ?? getDefaultWindow()
  const currentDocument = options.document ?? currentWindow?.document ?? getDefaultDocument()
  const pathname = options.pathname ?? currentWindow?.location.pathname
  const search = options.search ?? currentWindow?.location.search ?? ''
  const rootId = options.rootId || 'root'
  const root = options.root ?? currentDocument?.getElementById(rootId)

  if (!pathname) throw Error('Missing pathname for auto pages bootstrap.')
  if (!root) throw Error(`Missing root element #${rootId}.`)

  const page = resolvePageModule(options.pageModules, pathname, resolvePageQuery(search))

  if (!page) throw Error(`Cannot resolve page for ${pathname}`)

  const props = currentWindow?.__FAASJS_REACT_SSR__?.props || (await resolvePageProps(page))
  const element = createElement(page.module.default, props)

  if (root.innerHTML.trim()) hydrateRoot(root, element)
  else createRoot(root).render(element)

  return page
}
