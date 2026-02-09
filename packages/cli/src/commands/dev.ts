import { spawn } from 'node:child_process'
import type { Command } from 'commander'
import { getRootPath } from '../helper'

export function action(opts: { port?: number | string }): void {
  const port = Number(opts.port || 5173)
  const rootPath = getRootPath()

  const childProcess = spawn(`npm exec vite -- --host 0.0.0.0 --port ${port}`, {
    cwd: rootPath,
    stdio: 'inherit',
    shell: true,
  })

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
    .description('Start Vite dev server')
    .option('-p, --port <port>', 'Port', '5173')
    .on('--help', () => {
      console.log(
        '\nExamples:\n  npm exec faas dev\n  npm exec faas dev -- --port 5173'
      )
    })
    .action(action)
}
