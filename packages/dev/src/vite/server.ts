import { join } from 'node:path'

import { Server } from '@faasjs/core'
import { Logger } from '@faasjs/node-utils'
import type { Plugin } from 'vite'

import { resolveServerConfig } from '../shared/server_config.ts'
import { generateFaasTypes, isTypegenSourceFile } from '../typegen/index.ts'

const TYPEGEN_DEBOUNCE = 120

function isFaasServerSourceFile(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, '/')

  if (normalized.includes('/node_modules/')) return false
  if (normalized.includes('/.faasjs/')) return false
  if (normalized.endsWith('.d.ts')) return false

  if (/(^|\/)faas\.ya?ml$/.test(normalized)) return true
  if (/(^|\/)tsconfig\.json$/.test(normalized)) return true

  return (
    normalized.endsWith('.func.ts') ||
    normalized.endsWith('.ts') ||
    normalized.endsWith('.tsx') ||
    normalized.endsWith('.mts')
  )
}

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

  if (pathname.startsWith(`${base}/`)) return `${pathname.slice(base.length)}${search}`

  return url
}

/**
 * Create a Vite plugin that forwards POST requests to an in-process FaasJS server.
 *
 * The plugin resolves server settings from `src/faas.yaml`, strips the Vite
 * `base` prefix from request URLs, restarts the in-process server when source
 * files change, and refreshes generated route declarations for `@faasjs/types`.
 *
 * @returns Vite plugin instance for local FaasJS development.
 * @see {@link generateFaasTypes}
 * @example
 * ```ts
 * import { defineConfig } from 'vite'
 * import react from '@vitejs/plugin-react'
 * import { viteFaasJsServer } from '@faasjs/dev'
 *
 * export default defineConfig({
 *   plugins: [react(), viteFaasJsServer()],
 * })
 * ```
 */
export function viteFaasJsServer(): Plugin {
  let config: ResolvedViteFaasJsServerConfig
  let server: Server | null = null
  const logger = new Logger('FaasJs:Vite')

  const closeFaasServer = async (currentServer: Server | null) => {
    if (!currentServer) return

    try {
      await currentServer.close()
    } catch (error: any) {
      logger.error('[faas server] failed to close: %s', error.message)
    }
  }

  return {
    name: 'vite:faasjs',
    enforce: 'pre' as const,
    configResolved(resolvedConfig) {
      if (process.env.VITEST) {
        logger.debug('Skipping faas server in vitest environment')
        return
      }

      const { root, base } = resolveServerConfig(resolvedConfig.root, logger, resolvedConfig.base)

      config = {
        root,
        base: normalizeBase(base),
      }
    },
    configureServer: async (viteServer) => {
      if (process.env.VITEST) return

      if (!config) throw new Error('viteFaasJsServer: config is not resolved')

      const { middlewares, watcher } = viteServer

      let moduleVersion = Number(process.env.FAASJS_MODULE_VERSION || Date.now())

      const mountFaasServer = () => {
        process.env.FAASJS_MODULE_VERSION = `${moduleVersion}`

        const previousServer = server
        server = new Server(join(config.root, 'src'))

        return previousServer
      }

      const restartFaasServer = async () => {
        moduleVersion += 1
        const previousServer = mountFaasServer()

        await closeFaasServer(previousServer)
        logger.debug('[faas server] restarted %s', process.env.FAASJS_MODULE_VERSION)
      }

      mountFaasServer()

      const runTypegen = async () => {
        try {
          const result = await generateFaasTypes({
            root: config.root,
          })

          logger.debug(
            '[faas types] %s %s (%i routes)',
            result.changed ? 'generated' : 'up-to-date',
            result.output,
            result.routeCount,
          )
        } catch (error: any) {
          logger.error('[faas types] %s', error.message)
        }
      }

      let timer: ReturnType<typeof setTimeout> | undefined
      let typegenChain = Promise.resolve()
      let restartTimer: ReturnType<typeof setTimeout> | undefined
      let restartChain = Promise.resolve()

      const scheduleTypegen = () => {
        if (timer) clearTimeout(timer)

        timer = setTimeout(() => {
          typegenChain = typegenChain.then(runTypegen)
        }, TYPEGEN_DEBOUNCE)
      }

      const scheduleRestart = () => {
        if (restartTimer) clearTimeout(restartTimer)

        restartTimer = setTimeout(() => {
          restartChain = restartChain.then(restartFaasServer)
        }, TYPEGEN_DEBOUNCE)
      }

      await runTypegen()

      const handleWatcherChange = (_eventName: string, filePath: string) => {
        if (isTypegenSourceFile(filePath)) scheduleTypegen()

        if (isFaasServerSourceFile(filePath)) scheduleRestart()
      }

      watcher.on('all', handleWatcherChange)

      middlewares.use(async (req, res, next) => {
        if (!req.url || req.method !== 'POST' || !server) return next()

        const originalUrl = req.url
        req.url = stripBase(req.url, config.base)

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
              }),
            )
            res.end()
          }
        } finally {
          req.url = originalUrl
        }

        if (!res.writableEnded) next()
      })

      let disposePromise: Promise<void> | undefined
      const dispose = () => {
        disposePromise ||= (async () => {
          if (timer) clearTimeout(timer)

          if (restartTimer) clearTimeout(restartTimer)

          watcher.off('all', handleWatcherChange)

          await typegenChain
          await restartChain

          const currentServer = server
          server = null

          await closeFaasServer(currentServer)
        })()

        return disposePromise
      }

      const closeViteServer = viteServer.close.bind(viteServer)
      viteServer.close = async () => {
        await dispose()

        return await closeViteServer()
      }
    },
  }
}
