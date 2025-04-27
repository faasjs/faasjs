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
 * ## Options
 *
 * See {@link ViteFaasJsServerOptions} for more options.
 *
 * @packageDocumentation
 */
import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process'
import { request } from 'node:http'
import type { Plugin } from 'vite'

export type ViteFaasJsServerOptions = {
  /** faas server root path, default is vite's root */
  root: string
  /** faas server base path, default is as same as vite's base */
  base: string
  /** faas server port, 3000 as default */
  port: number
  /** custom command to run the faas server */
  command: string
}

export function viteFaasJsServer(
  options: Partial<ViteFaasJsServerOptions> = {}
): Plugin {
  let config: ViteFaasJsServerOptions
  let childProcess: ChildProcessWithoutNullStreams | null = null

  return {
    name: 'vite:faasjs',
    enforce: 'pre' as const,
    configResolved(resolvedConfig) {
      const root = options.root || resolvedConfig.root
      const base = options.base || resolvedConfig.base
      const port = options.port || 3000

      config = {
        root,
        base,
        port,
        command:
          options.command ||
          `npm exec faas dev -- -p ${port} -r ${root}${base} -v`,
      }
    },
    configureServer: async ({ middlewares }) => {
      if (!config) throw new Error('viteFaasJsServer: config is not resolved')

      if (childProcess) {
        childProcess.kill()
        childProcess = null
      }

      childProcess = spawn(config.command, {
        stdio: 'pipe',
        shell: true,
      })

      childProcess.stdout.on('data', data =>
        console.log(data.toString().trim())
      )

      childProcess.stderr.on('data', data =>
        console.error(data.toString().trim())
      )

      middlewares.use(async (req, res, next) => {
        if (!req.url || req.method !== 'POST') return next()

        try {
          const targetUrl = `http://localhost:${config.port}${req.url.replace(config.base, '')}`

          let body = null

          const chunks = []
          for await (const chunk of req) {
            chunks.push(chunk)
          }
          body = Buffer.concat(chunks).toString()

          try {
            body = JSON.parse(body)
          } catch (e) {
            console.error('Failed to parse JSON:', e)
          }

          const headers: Record<string, any> = {}
          for (const [key, value] of Object.entries(req.headers))
            if (!['host', 'connection'].includes(key)) headers[key] = value

          return new Promise(resolve => {
            const proxyReq = request(
              targetUrl,
              {
                method: 'POST',
                headers,
              },
              proxyRes => {
                res.statusCode = proxyRes.statusCode || 200

                for (const key of Object.keys(proxyRes.headers)) {
                  const value = proxyRes.headers[key]
                  if (value) res.setHeader(key, value)
                }

                proxyRes.pipe(res)
              }
            )

            if (body) {
              proxyReq.write(JSON.stringify(body))
            }

            proxyReq.on('error', err => {
              console.error(`\u001b[031m${err.toString()}\u001b[39m`)
              next()
              resolve()
            })

            proxyReq.end()
          })
        } catch (error: any) {
          console.error(`\u001b[031m${error.toString()}\u001b[39m`)

          return next()
        }
      })
    },
    closeBundle() {
      if (childProcess) {
        childProcess.kill()
        childProcess = null
      }
    },
  }
}
