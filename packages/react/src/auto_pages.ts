import type { ComponentType } from 'react'

/**
 * Query value passed to auto-discovered page loaders.
 */
export type PageQueryValue = string | string[]

/**
 * Parsed query object passed to auto-discovered page loaders.
 */
export type PageQuery = Record<string, PageQueryValue>

/**
 * Route context passed to an auto-discovered page `loader`.
 */
export type PageLoaderContext = {
  pathname: string
  query: PageQuery
  basePath: string
  restPath: string
}

/**
 * Result returned by an auto-discovered page `loader`.
 */
export type PageLoaderResult<Props = Record<string, unknown>> = {
  props?: Props
  statusCode?: number
  headers?: Record<string, string>
}

/**
 * Auto-discovered page module contract.
 */
export type PageModule<Props = Record<string, unknown>> = {
  default: ComponentType<Props>
  loader?:
    | ((context: PageLoaderContext) => Promise<PageLoaderResult<Props>>)
    | ((context: PageLoaderContext) => PageLoaderResult<Props>)
}

/**
 * Auto-discovered page module collection keyed by normalized `./pages/...` paths.
 */
export type PageModules = Record<string, PageModule<any>>

/**
 * Resolved page module plus the matched loader context.
 */
export type ResolvedPage = {
  module: PageModule<any>
  context: PageLoaderContext
}

/**
 * Serialized SSR payload exposed on `window.__FAASJS_REACT_SSR__`.
 */
export type PagePayload = {
  props?: Record<string, unknown>
}

/**
 * Window shape used by the auto-pages browser bootstrap.
 */
export type AutoPagesWindow = Window & {
  __FAASJS_REACT_SSR__?: PagePayload
}

/**
 * Result returned by the auto-pages SSR renderer.
 */
export type RenderPageResult = PageLoaderResult & {
  props: Record<string, unknown>
  html: string
}

/**
 * Options for the auto-pages SSR renderer.
 */
export type RenderPageOptions = {
  pathname: string
  query: PageQuery
}

/**
 * Options for the auto-pages browser bootstrap.
 */
export type BootstrapAutoPagesOptions = {
  pageModules: PageModules
  pathname?: string
  search?: string
  root?: HTMLElement | null
  rootId?: string
  document?: Document
  window?: AutoPagesWindow
}

function toRoutePath(segments: string[]): string {
  return segments.length ? `/${segments.join('/')}` : '/'
}

/**
 * Parse a URL search string into the query object used by auto-discovered pages.
 *
 * @param {string | URLSearchParams} search - Search string or `URLSearchParams`.
 * @returns Parsed query object where repeated keys become string arrays.
 */
export function resolvePageQuery(search: string | URLSearchParams): PageQuery {
  const query: PageQuery = {}
  const searchParams = search instanceof URLSearchParams ? search : new URLSearchParams(search)

  for (const key of new Set(searchParams.keys())) {
    const values = searchParams.getAll(key)

    query[key] = values.length > 1 ? values : (values[0] ?? '')
  }

  return query
}

/**
 * Resolve a matched page module from normalized `./pages/...` entries.
 *
 * The lookup probes `index.tsx`, then `default.tsx`, then walks parent
 * `default.tsx` fallbacks toward the root scope.
 *
 * @param {PageModules} pageModules - Auto-discovered page module map.
 * @param {string} pathname - Browser pathname to resolve.
 * @param {PageQuery} query - Parsed query object for the current request.
 * @returns The matched page module with loader context, or `null` when no page matches.
 */
export function resolvePageModule(
  pageModules: PageModules,
  pathname: string,
  query: PageQuery,
): ResolvedPage | null {
  const segments = pathname.split('/').filter(Boolean)
  const seen = new Set<string>()

  const match = (scope: string[], filename: 'index' | 'default', rest: string[]) => {
    const file = scope.length ? `${scope.join('/')}/${filename}.tsx` : `${filename}.tsx`

    if (seen.has(file)) return null

    seen.add(file)
    const page = pageModules[`./pages/${file}`]

    if (!page) return null

    return {
      module: page,
      context: {
        pathname,
        query,
        basePath: toRoutePath(scope),
        restPath: rest.length ? `/${rest.join('/')}` : '',
      },
    } satisfies ResolvedPage
  }

  const exactMatch = match(segments, 'index', []) || match(segments, 'default', [])

  if (exactMatch) return exactMatch

  for (let depth = segments.length - 1; depth >= 0; depth -= 1) {
    const scope = segments.slice(0, depth)
    const rest = segments.slice(depth)
    const fallbackMatch = match(scope, 'default', rest)

    if (fallbackMatch) return fallbackMatch
  }

  return null
}
