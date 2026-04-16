import type { ComponentType } from 'react'

/**
 * Query value parsed from the current route search string.
 */
export type PageQueryValue = string | string[]

/**
 * Parsed query object for the current route.
 */
export type PageQuery = Record<string, PageQueryValue>

/**
 * Route context returned by file-based page resolution.
 */
export type PageRouteContext = {
  pathname: string
  query: PageQuery
  basePath: string
  restPath: string
}

/**
 * File-based page module contract.
 */
export type PageModule = {
  default: ComponentType
}

/**
 * File-based page module collection keyed by normalized `./pages/...` paths.
 */
export type PageModules = Record<string, PageModule>

/**
 * Resolved page module plus the matched route context.
 */
export type ResolvedPage = {
  module: PageModule
  context: PageRouteContext
}

/**
 * Window shape used by the routing browser bootstrap.
 */
export type RoutingWindow = Window

/**
 * @deprecated Use {@link RoutingWindow} instead.
 */
export type AutoPagesWindow = RoutingWindow

/**
 * Options for the routing browser bootstrap.
 */
export type BootstrapRoutingOptions = {
  pageModules: PageModules
  pathname?: string
  search?: string
  root?: HTMLElement | null
  rootId?: string
  document?: Document
  window?: RoutingWindow
}

/**
 * @deprecated Use {@link BootstrapRoutingOptions} instead.
 */
export type BootstrapAutoPagesOptions = BootstrapRoutingOptions

function toRoutePath(segments: string[]): string {
  return segments.length ? `/${segments.join('/')}` : '/'
}

/**
 * Parse a URL search string into the query object used by file-based routing.
 *
 * @param {string | URLSearchParams} search - Search string or `URLSearchParams`.
 * @returns Parsed query object where repeated keys become string arrays.
 *
 * @example
 * ```ts
 * const query = resolvePageQuery('?tag=faasjs&tag=docs')
 * ```
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
 * @param {PageModules} pageModules - File-based page module map.
 * @param {string} pathname - Browser pathname to resolve.
 * @param {PageQuery} query - Parsed query object for the current request.
 * @returns The matched page module with route context, or `null` when no page matches.
 *
 * @example
 * ```ts
 * const page = resolvePageModule(
 *   { './pages/index.tsx': { default: () => null } },
 *   '/',
 *   {},
 * )
 * ```
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
