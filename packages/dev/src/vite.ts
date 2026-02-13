import { join } from 'node:path'
import { Logger } from '@faasjs/logger'
import { Server } from '@faasjs/server'
import type { Plugin } from 'vite'
import { generateFaasTypes, isTypegenSourceFile } from './typegen'

export type ViteFaasTypegenOptions = {
  /** enable or disable type generation, default is true */
  enabled: boolean
  /** faas source directory, default is <root>/src */
  src: string
  /** output declaration file path, default is <src>/.faasjs/types.d.ts */
  output: string
  /** staging for faas.yaml, default is development */
  staging: string
  /** enable watch mode in vite dev server, default is true */
  watch: boolean
  /** debounce time for file changes in ms, default is 120 */
  debounce: number
}

export type ViteFaasJsServerOptions = {
  /** faas project root path, default is vite's root */
  root: string
  /** faas server base path, default is vite's base */
  base: string
  /** api/event type generation options */
  types: boolean | Partial<ViteFaasTypegenOptions>
}

type ResolvedViteFaasJsServerOptions = Omit<
  ViteFaasJsServerOptions,
  'types'
> & {
  types: ViteFaasTypegenOptions
}

function normalizeTypegenOptions(
  options: boolean | Partial<ViteFaasTypegenOptions> | undefined
): ViteFaasTypegenOptions {
  if (options === false)
    return {
      enabled: false,
      src: 'src',
      output: 'src/.faasjs/types.d.ts',
      staging: 'development',
      watch: false,
      debounce: 120,
    }

  const config =
    options && typeof options === 'object' ? options : Object.create(null)

  return {
    enabled: config.enabled ?? true,
    src: config.src || 'src',
    output: config.output || 'src/.faasjs/types.d.ts',
    staging: config.staging || 'development',
    watch: config.watch ?? true,
    debounce: config.debounce ?? 120,
  }
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
 * It resolves project root/base from Vite config and strips `base` from request URL
 * before forwarding to `@faasjs/server`.
 */
export function viteFaasJsServer(
  options: Partial<ViteFaasJsServerOptions> & Record<string, unknown> = {}
): Plugin {
  let config: ResolvedViteFaasJsServerOptions
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
        types: normalizeTypegenOptions(
          options.types as ViteFaasJsServerOptions['types']
        ),
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
        if (!config.types.enabled) return

        try {
          const result = await generateFaasTypes({
            root: config.root,
            src: config.types.src,
            output: config.types.output,
            staging: config.types.staging,
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
        }, config.types.debounce)
      }

      await runTypegen()

      if (config.types.enabled && config.types.watch)
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
