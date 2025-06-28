import { Server } from '@faasjs/server'
import type { Command } from 'commander'
import { defaultsEnv } from '../helper'

export function action(opts: { port?: number }): void {
  defaultsEnv()

  const server = new Server(process.env.FaasRoot, {
    port: opts.port || 3000,
  })

  server.listen()
}

export function ServerCommand(program: Command): void {
  program
    .command('server')
    .name('server')
    .description('Start faas server')
    .on('--help', () => {
      console.log(`
Examples:
  npm exec faas server`)
    })
    .option('-p, --port <port>', 'Port', '3000')
    .action(action)
}
