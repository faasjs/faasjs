import { spawnSync } from 'node:child_process'
import { resolve, sep } from 'node:path'

export function defaultsEnv(): void {
  if (!process.env.FaasRoot) process.env.FaasRoot = process.cwd() + sep

  if (!process.env.FaasRoot.endsWith(sep)) process.env.FaasRoot += sep

  if (!process.env.FaasEnv) process.env.FaasEnv = 'development'

  if (!process.env.FaasLog) process.env.FaasLog = 'info'
}

export function getRootPath(): string {
  defaultsEnv()

  return resolve(process.env.FaasRoot as string)
}

export function runCommand(command: string, cwd = getRootPath()): void {
  const result = spawnSync(command, {
    cwd,
    shell: true,
    stdio: 'inherit',
  })

  if ((result.status || 0) !== 0)
    throw Error(`Command failed: ${command} (${result.status || 1})`)
}
