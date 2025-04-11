import { spawn } from 'node:child_process'
import { join } from 'node:path'
import type { Command } from 'commander'
import { defaultsEnv } from '../helper'

export function action(opts: {
  port?: number
}): void {
  defaultsEnv()

  const childProcess = spawn(
    `FaasRoot=${process.env.FaasRoot} FaasPort=${opts.port || 3000} npm exec tsx watch ${join(__dirname, '..', 'devServer.ts')}`,
    {
      stdio: 'pipe',
      shell: true,
    }
  )

  childProcess.stdout.on('data', data => console.log(data.toString().trim()))

  childProcess.stderr.on('data', data => console.error(data.toString().trim()))

  process
    .on('SIGTERM', async () => {
      childProcess.kill('SIGTERM')
      process.exit(0)
    })
    .on('SIGINT', async () => {
      childProcess.kill('SIGINT')
      process.exit(0)
    })
}

export function DevCommand(program: Command): void {
  program
    .command('dev')
    .name('dev')
    .description('Start faas development server')
    .on('--help', () => {
      console.log(`
Examples:
  npm exec faas dev`)
    })
    .option('-p, --port <port>', 'Port', '3000')
    .action(action)
}
