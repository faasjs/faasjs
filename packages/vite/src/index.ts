/**
 * FaasJS's vite plugin.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/vite.svg)](https://github.com/faasjs/faasjs/blob/main/packages/vite/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/vite.svg)](https://www.npmjs.com/package/@faasjs/vite)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/vite
 * ```
 *
 * ## Usage
 *
 * Add to vite.config.ts
 *
 * ```ts
 * import { viteFaasJsServer } from '@faasjs/vite'
 *
 * export default defineConfig({
 *   plugins: [
 *     viteFaasJsServer() // add this line
 *   ],
 * })
 * ```
 *
 * The plugin starts an in-process FaasJS server during Vite development.
 *
 * ## Options
 *
 * See {@link ViteFaasJsServerOptions} for more options.
 *
 * @packageDocumentation
 */
import { join } from 'node:path'
import { Logger } from '@faasjs/logger'
import { Server } from '@faasjs/server'
import type { Plugin } from 'vite'

export type ViteFaasJsServerOptions = {
  /** faas project root path, default is vite's root */
  root: string
  /** faas server base path, default is vite's base */
  base: string
}

function normalizeBase(base: string): string {
  const normalized = base.startsWith('/') ? base : `/${base}`

  if (normalized === '/') return '/'

  return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized
}

function stripBase(url: string, base: string): string {
  if (base === '/') return url

  const queryIndex = url.indexOf('?')
  const pathname = queryIndex >= 0 ? url.slice(0, queryIndex) : url
  const search = queryIndex >= 0 ? url.slice(queryIndex) : ''

  if (pathname === base) return `/${search}`

  if (pathname.startsWith(`${base}/`))
    return `${pathname.slice(base.length)}${search}`

  return url
}

export function viteFaasJsServer(
  options: Partial<ViteFaasJsServerOptions> & Record<string, unknown> = {}
): Plugin {
  let config: ViteFaasJsServerOptions
  let server: Server | null = null
  const logger = new Logger('FaasJs:Vite')

  return {
    name: 'vite:faasjs',
    enforce: 'pre' as const,
    configResolved(resolvedConfig) {
      const root = options.root || resolvedConfig.root
      const base = normalizeBase(options.base || resolvedConfig.base)

      config = {
        root,
        base,
      }
    },
    configureServer: async ({ middlewares }) => {
      if (process.env.VITEST) {
        logger.debug('Skipping faas server in vitest environment')
        return
      }

      if (!config) throw new Error('viteFaasJsServer: config is not resolved')

      server = new Server(join(config.root, 'src'))

      middlewares.use(async (req, res, next) => {
        if (!req.url || req.method !== 'POST' || !server) return next()

        const originalUrl = req.url
        const strippedUrl = stripBase(req.url, config.base)
        req.url = strippedUrl

        try {
          logger.debug(`Request ${req.url}`)

          await server.handle(req, res, {
            requestedAt: Date.now(),
          })
        } catch (error: any) {
          logger.error(error)

          if (!res.headersSent && !res.writableEnded) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.write(
              JSON.stringify({
                error: { message: 'Internal Server Error' },
              })
            )
            res.end()
          }
        } finally {
          req.url = originalUrl
        }

        if (!res.writableEnded) next()
      })
    },
  }
}
