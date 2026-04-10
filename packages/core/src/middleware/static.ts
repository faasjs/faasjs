import { createReadStream, existsSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { resolve } from 'node:path'

import { lookup } from 'mime-types'

import { ensureRequestUrl } from '../request-url'
import { respondWithInternalServerError } from '../response-error'
import { nameFunc } from '../utils'
import type { Middleware, MiddlewareContext } from './middleware'

/**
 * Options for {@link staticHandler}.
 */
export type StaticHandlerOptions = {
  /**
   * Root directory used to resolve requested files.
   */
  root: string
  /**
   * Fallback behavior used when a file is missing.
   *
   * Set `true` to send a default `404 Not Found` response, a string to serve a fallback file,
   * a middleware function to handle the miss manually, or `false` to leave the response untouched.
   *
   * @default false
   */
  notFound?: Middleware | boolean | string
  /**
   * Cache control for resolved static files.
   *
   * Set `true` to cache by root directory, a string to use a custom cache namespace,
   * or `false` to disable lookup caching.
   *
   * @default true
   */
  cache?: boolean | string
  /**
   * URL prefix removed before resolving the file path.
   *
   * @example
   * ```ts
   * import { useMiddleware, staticHandler } from '@faasjs/core'
   *
   * export const func = useMiddleware(
   *   staticHandler({
   *     root: `${__dirname}/public`,
   *     stripPrefix: '/public',
   *   }),
   * )
   * ```
   */
  stripPrefix?: string | RegExp
}

type StaticHandlerCache =
  | {
      path: string
      mimeType: string
    }
  | false

const cachedStaticFiles = new Map<string, StaticHandlerCache>()

async function respondWithNotFound(
  options: StaticHandlerOptions,
  request: IncomingMessage & {
    body?: any
  },
  response: ServerResponse,
  context: MiddlewareContext,
) {
  if (!options.notFound) return

  if (options.notFound === true) {
    response.statusCode = 404
    response.end('Not Found')
    return
  }

  if (typeof options.notFound === 'string') {
    const path = resolve(options.root, options.notFound)

    return await respondWithFile(path, lookup(path) || 'application/octet-stream', response)
  }

  return await options.notFound(request, response, context)
}

async function respondWithFile(path: string, mimeType: string, response: ServerResponse) {
  const stream = createReadStream(path)
  response.setHeader('Content-Type', mimeType)

  await new Promise<void>((resolve, reject) => {
    stream
      .on('error', (error) => {
        respondWithInternalServerError(response)
        reject(error)
      })
      .on('end', resolve)

    stream.pipe(response)
  })
}

/**
 * Create middleware that serves static files from a directory.
 *
 * The middleware resolves the request URL relative to `options.root`, serves the matching file,
 * and optionally delegates missing files to `options.notFound`.
 *
 * @param {StaticHandlerOptions} options - Static file serving options.
 * @param {string} options.root - Root directory used to resolve requested files.
 * @param {Middleware | boolean | string} [options.notFound] - Fallback behavior when a file is missing.
 * @param {boolean | string} [options.cache] - Cache toggle or cache namespace used for lookup results.
 * @param {string | RegExp} [options.stripPrefix] - URL prefix removed before resolving the file path.
 * @returns {Middleware} Middleware that serves files from the configured root directory.
 *
 * @example
 * ```ts
 * import { staticHandler, useMiddleware } from '@faasjs/core'
 *
 * export const func = useMiddleware(
 *   staticHandler({
 *     root: `${__dirname}/public`,
 *   }),
 * )
 * ```
 */
export function staticHandler(options: StaticHandlerOptions): Middleware {
  const handler: Middleware = async (request, response, context) => {
    const { logger } = context

    if (response.writableEnded) return

    const requestUrl = ensureRequestUrl(request, response)
    if (!requestUrl) return

    if (request.method !== 'GET' || requestUrl.slice(0, 2) === '/.') return

    const cacheKey =
      options.cache !== false ? `${options.cache || options.root}${requestUrl}` : null

    if (cacheKey) {
      const cached = cachedStaticFiles.get(cacheKey)

      if (cached === false) return await respondWithNotFound(options, request, response, context)

      if (cached) {
        response.setHeader('Content-Type', cached.mimeType)

        return await respondWithFile(cached.path, cached.mimeType, response)
      }
    }

    let url = options.stripPrefix ? requestUrl.replace(options.stripPrefix, '') : requestUrl

    if (url === '/') url = '/index.html'

    if (url.startsWith('/')) url = url.slice(1)

    logger.debug('finding:', requestUrl)

    const path = resolve(options.root, url)

    if (!existsSync(path)) {
      logger.debug('not found:', path)

      if (cacheKey) cachedStaticFiles.set(cacheKey, false)

      return await respondWithNotFound(options, request, response, context)
    }

    const mimeType = lookup(path) || 'application/octet-stream'

    logger.debug('found:', mimeType, url)

    if (cacheKey)
      cachedStaticFiles.set(cacheKey, {
        path,
        mimeType,
      })

    return await respondWithFile(path, mimeType, response)
  }

  nameFunc('static', handler)

  return handler
}
