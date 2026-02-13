import { join } from 'node:path'
import { Logger } from '@faasjs/logger'
import { Server } from '@faasjs/server'
import type { Plugin } from 'vite'
import { resolveServerConfig } from './server_config'
import { generateFaasTypes, isTypegenSourceFile } from './typegen'

const TYPEGEN_DEBOUNCE = 120

type ResolvedViteFaasJsServerConfig = {
  root: string
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

/**
 * Create a Vite plugin that proxies POST requests to an in-process FaasJS server.
 *
 * It resolves server root/base from `src/faas.yaml` and strips `base` from
 * request URL before forwarding to `@faasjs/server`.
 */
export function viteFaasJsServer(): Plugin {
  let config: ResolvedViteFaasJsServerConfig
  let server: Server | null = null
  const logger = new Logger('FaasJs:Vite')

  return {
    name: 'vite:faasjs',
    enforce: 'pre' as const,
    configResolved(resolvedConfig) {
      const serverConfig = resolveServerConfig(
        resolvedConfig.root,
        logger,
        resolvedConfig.base
      )

      config = {
        root: serverConfig.root,
        base: normalizeBase(serverConfig.base),
      }
    },
    configureServer: async ({ middlewares, watcher }) => {
      if (process.env.VITEST) {
        logger.debug('Skipping faas server in vitest environment')
        return
      }

      if (!config) throw new Error('viteFaasJsServer: config is not resolved')

      server = new Server(join(config.root, 'src'))

      const runTypegen = async () => {
        try {
          const result = await generateFaasTypes({
            root: config.root,
          })

          logger.debug(
            '[faas-types] %s %s (%i routes)',
            result.changed ? 'generated' : 'up-to-date',
            result.output,
            result.routeCount
          )
        } catch (error: any) {
          logger.error('[faas-types] %s', error.message)
        }
      }

      let timer: ReturnType<typeof setTimeout> | null = null
      let runningTypegen = false
      let pendingTypegen = false

      const flushTypegen = async () => {
        if (runningTypegen || !pendingTypegen) return

        pendingTypegen = false
        runningTypegen = true

        try {
          await runTypegen()
        } finally {
          runningTypegen = false
          if (pendingTypegen) void flushTypegen()
        }
      }

      const scheduleTypegen = () => {
        pendingTypegen = true

        if (timer) clearTimeout(timer)

        timer = setTimeout(() => {
          void flushTypegen()
        }, TYPEGEN_DEBOUNCE)
      }

      await runTypegen()

      watcher.on('all', (_eventName, filePath) => {
        if (!isTypegenSourceFile(filePath)) return

        scheduleTypegen()
      })

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
