import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { Server, staticHandler } from '@faasjs/server'
import type { Command } from 'commander'
import { defaultsEnv, getRootPath } from '../helper'

type StartOptions = {
  port?: number | string
  apiOnly?: boolean
}

export function action(opts: StartOptions): void {
  defaultsEnv()

  const rootPath = getRootPath()
  const srcPath = join(rootPath, 'src')

  if (!existsSync(srcPath)) throw Error(`Can't find src path in ${rootPath}`)

  const publicHandler = staticHandler({
    root: join(rootPath, 'public'),
    notFound: false,
  })

  const hasDistFallback = existsSync(join(rootPath, 'dist', 'index.html'))

  const distHandler = staticHandler({
    root: join(rootPath, 'dist'),
    notFound: hasDistFallback ? 'index.html' : false,
  })

  const port = Number(opts.port || 3000)

  const server = new Server(srcPath, {
    port,
    beforeHandle: async (req, res, ctx) => {
      if (opts.apiOnly || !req.url || req.method !== 'GET') return

      await publicHandler(req, res, ctx)
      await distHandler(req, res, ctx)
    },
  })

  server.listen()
}

export function StartCommand(program: Command): void {
  program
    .command('start')
    .description('Start faas production server')
    .option('-p, --port <port>', 'Port', '3000')
    .option('--api-only', 'Only serve API routes', false)
    .on('--help', () => {
      console.log(
        '\nExamples:\n  npm exec faas start\n  npm exec faas start -- --api-only'
      )
    })
    .action(action)
}
