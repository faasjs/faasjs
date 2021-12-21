/* eslint-disable @typescript-eslint/no-var-requires */
import { join } from 'path'
import { Command } from 'commander'
import { Server } from '@faasjs/server'
import { defaultsEnv } from '../helper'
import { readFileSync } from 'fs'

export function action (opts: {
  port?: number
  cache?: boolean
}): void {
  const tsconfig = JSON.parse(readFileSync(join(process.cwd(), 'tsconfig.json')).toString())

  if (tsconfig.compilerOptions?.baseUrl && tsconfig.compilerOptions?.paths)
    require('tsconfig-paths').register({
      baseUrl: tsconfig.compilerOptions.baseUrl || '.',
      paths: tsconfig.compilerOptions.paths || {}
    })

  require('ts-node').register({
    project: join(process.cwd(), 'tsconfig.json'),
    compilerOptions: { module: 'commonjs' },
    transpileOnly: true,
    typeCheck: false
  })

  defaultsEnv()

  const server = new Server(process.env.FaasRoot, {
    cache: opts.cache,
    port: opts.port || 3000
  })

  server.listen()
}

export function ServerCommand (program: Command): void {
  program
    .command('server')
    .name('server')
    .description('Start local server')
    .on('--help', function () {
      console.log(`
Examples:
  npm exec faas server`)
    })
    .option('-p, --port <port>', 'Port', '3000')
    .option('-c, --cache', 'Cache functions', false)
    .action(action)
}
