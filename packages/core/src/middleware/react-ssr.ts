import { existsSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { getRouteFiles } from '../server/routes'
import { nameFunc } from '../utils'
import type { Middleware } from './middleware'
import { staticHandler } from './static'

/**
 * Query value shape passed to React SSR page renderers.
 */
export type ReactSsrQueryValue = string | string[]

/**
 * Parsed URL query object passed to React SSR page renderers.
 */
export type ReactSsrQuery = Record<string, ReactSsrQueryValue>

/**
 * Result returned by a React SSR page renderer.
 */
export type ReactSsrRenderPageResult = {
  /**
   * Rendered HTML inserted into the template root element.
   */
  html: string
  /**
   * Serialized payload exposed on `window.__FAASJS_REACT_SSR__`.
   */
  props?: Record<string, unknown>
  /**
   * Optional HTTP status code for the rendered page.
   */
  statusCode?: number
  /**
   * Optional response headers for the rendered page.
   */
  headers?: Record<string, string>
}

/**
 * Page renderer used by {@link reactSsrHandler}.
 */
export type ReactSsrRenderPage = (options: {
  pathname: string
  query: ReactSsrQuery
}) => Promise<ReactSsrRenderPageResult | null>

/**
 * Options for {@link reactSsrHandler}.
 */
export type ReactSsrHandlerOptions = {
  /**
   * Directory containing built client assets and `index.html`.
   */
  root: string
  /**
   * Directory containing the built React SSR entry bundle.
   *
   * When `renderPage` is omitted, `reactSsrHandler()` looks for
   * `entry-server.*` and `server-entry.*` under this directory.
   */
  serverRoot?: string
  /**
   * React SSR page renderer or path(s) to a built module that exports it.
   */
  renderPage?: ReactSsrRenderPage | string | string[]
  /**
   * Export name used when loading `renderPage` from a module path.
   *
   * @default 'renderPage'
   */
  renderPageExport?: string
  /**
   * Template file under `root`.
   *
   * @default 'index.html'
   */
  template?: string
}

function resolveReactSsrQuery(searchParams: URLSearchParams): ReactSsrQuery {
  const query: ReactSsrQuery = {}

  for (const key of new Set(searchParams.keys())) {
    const values = searchParams.getAll(key)

    query[key] = values.length > 1 ? values : (values[0] ?? '')
  }

  return query
}

function escapeJsonForHtml(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

function hasExactPageRoute(sourceRoot: string, pathname: string): boolean {
  const pageRoot = join(sourceRoot, 'pages')

  if (pathname === '/')
    return existsSync(join(pageRoot, 'index.tsx')) || existsSync(join(pageRoot, 'default.tsx'))

  const exactPageRoot = join(pageRoot, ...pathname.split('/').filter(Boolean))

  return (
    existsSync(join(exactPageRoot, 'index.tsx')) || existsSync(join(exactPageRoot, 'default.tsx'))
  )
}

function hasMatchedFaasRoute(sourceRoot: string, pathname: string): boolean {
  return getRouteFiles(sourceRoot, join(sourceRoot, pathname)).some((candidate) =>
    existsSync(candidate),
  )
}

async function resolveReactSsrRenderPage(
  options: ReactSsrHandlerOptions,
): Promise<ReactSsrRenderPage> {
  if (typeof options.renderPage === 'function') return options.renderPage

  const candidates = options.renderPage
    ? Array.isArray(options.renderPage)
      ? options.renderPage
      : [options.renderPage]
    : options.serverRoot
      ? [
          join(options.serverRoot, 'entry-server.mjs'),
          join(options.serverRoot, 'entry-server.js'),
          join(options.serverRoot, 'server-entry.mjs'),
          join(options.serverRoot, 'server-entry.js'),
        ]
      : []
  const entry = candidates.find((candidate) => existsSync(candidate))

  if (!entry)
    throw Error('Missing React SSR entry. Build the SSR bundle before starting the server.')

  const exportName = options.renderPageExport || 'renderPage'
  const module = (await import(pathToFileURL(entry).href)) as Record<string, unknown>
  const renderPage = module[exportName]

  if (typeof renderPage !== 'function')
    throw Error(`Missing React SSR export "${exportName}" in ${entry}.`)

  return renderPage as ReactSsrRenderPage
}

/**
 * Create middleware that serves built assets first and falls back to React SSR HTML.
 *
 * The middleware serves matched static files from `options.root`, loads a built
 * React SSR renderer when needed, and injects serialized page props into the HTML
 * template.
 *
 * @param {ReactSsrHandlerOptions} options - React SSR handler options.
 * @returns {Middleware} Middleware that serves static assets and React SSR HTML.
 *
 * @example
 * ```ts
 * import { reactSsrHandler } from '@faasjs/core'
 * import { join } from 'node:path'
 *
 * const distRoot = join(process.cwd(), 'dist')
 * const distReactSsrRoot = join(process.cwd(), 'dist-server')
 *
 * const handler = reactSsrHandler({
 *   root: distRoot,
 *   serverRoot: distReactSsrRoot,
 * })
 * ```
 */
export function reactSsrHandler(options: ReactSsrHandlerOptions): Middleware {
  const templatePath = resolve(options.root, options.template || 'index.html')
  const assetsHandler = staticHandler({
    root: options.root,
    notFound: false,
  })

  let reactSsrHtmlTemplate = ''
  let reactSsrRenderPagePromise: Promise<ReactSsrRenderPage> | null = null

  const getHtmlTemplate = () => {
    if (reactSsrHtmlTemplate) return reactSsrHtmlTemplate

    if (!existsSync(templatePath))
      throw Error(
        `Missing React SSR template: ${templatePath}. Build the client bundle before starting the server.`,
      )

    reactSsrHtmlTemplate = readFileSync(templatePath, 'utf8')

    return reactSsrHtmlTemplate
  }

  const getReactSsrRenderPage = async () => {
    if (reactSsrRenderPagePromise) return await reactSsrRenderPagePromise

    reactSsrRenderPagePromise = resolveReactSsrRenderPage(options)

    return await reactSsrRenderPagePromise
  }

  const handler: Middleware = async (request, response, context) => {
    if (response.writableEnded || !request.url) return
    if (request.method !== 'GET' && request.method !== 'HEAD') return

    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`)
    const pathname = url.pathname
    const staticFile = pathname.split('/').filter(Boolean).join('/')
    const sourceRoot = context.root

    if (request.method === 'GET' && staticFile) {
      const staticPath = join(options.root, staticFile)

      if (existsSync(staticPath) && statSync(staticPath).isFile()) {
        const originalUrl = request.url

        request.url = pathname

        try {
          await assetsHandler(request, response, context)
        } finally {
          request.url = originalUrl
        }

        return
      }
    }

    // Let FaasJS route handlers win when the request does not resolve to an exact page.
    if (!hasExactPageRoute(sourceRoot, pathname) && hasMatchedFaasRoute(sourceRoot, pathname))
      return

    const renderPage = await getReactSsrRenderPage()
    const page = await renderPage({
      pathname,
      query: resolveReactSsrQuery(url.searchParams),
    })

    if (!page) return

    if (page.headers)
      for (const [key, value] of Object.entries(page.headers)) response.setHeader(key, value)

    if (typeof page.statusCode === 'number') response.statusCode = page.statusCode

    response.setHeader('Content-Type', 'text/html; charset=utf-8')

    if (request.method === 'HEAD') {
      response.end()
      return
    }

    response.end(
      getHtmlTemplate()
        .replace('<div id="root"></div>', `<div id="root">${page.html}</div>`)
        .replace(
          '</body>',
          `  <script>window.__FAASJS_REACT_SSR__=${escapeJsonForHtml({
            props: page.props || {},
          })}</script>\n  </body>`,
        ),
    )
  }

  return nameFunc('reactSsrHandler', handler)
}
