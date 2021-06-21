/* eslint-disable @typescript-eslint/no-var-requires */
import { join } from 'path'
import { Command } from 'commander'
import { Server } from '@faasjs/server'
import { defaultsEnv } from '../helper'

export function action (opts: {
  port: number
  cache: boolean
}): void {
  const tsconfig = require(join(process.cwd(), 'tsconfig.json'))

  if (tsconfig.compilerOptions?.baseUrl && tsconfig.compilerOptions?.paths)
    require('tsconfig-paths').register({
      baseUrl: tsconfig.compilerOptions.baseUrl || '.',
      paths: tsconfig.compilerOptions.paths || {}
    })

  require('ts-node').register({
    project: join(process.cwd(), 'tsconfig.json'),
    compilerOptions: { module: 'commonjs' }
  })

  defaultsEnv()

  const server = new Server(process.env.FaasRoot!, {
    cache: opts.cache,
    port: opts.port || 3000
  })

  server.listen()
}

export default function (program: Command): void {
  program
    .command('server')
    .name('server')
    .description('本地服务器')
    .on('--help', function () {
      console.log(`
Examples:
  yarn server`)
    })
    .option('-p, --port <port>', '端口号', '3000')
    .option('-c, --cache', '是否启用缓存', false)
    .action(action)
}
