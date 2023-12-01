import { Command } from 'commander'
import { Server } from '@faasjs/server'
import { defaultsEnv } from '../helper'

export function action(opts: {
  port?: number
  cache?: boolean
}): void {
  defaultsEnv()

  const server = new Server(process.env.FaasRoot, {
    cache: opts.cache,
    port: opts.port || 3000,
  })

  server.listen()
}

export function ServerCommand(program: Command): void {
  program
    .command('server')
    .name('server')
    .description('Start local server')
    .on('--help', () => {
      console.log(`
Examples:
  npm exec faas server`)
    })
    .option('-p, --port <port>', 'Port', '3000')
    .option('-c, --cache', 'Cache functions', false)
    .action(action)
}
