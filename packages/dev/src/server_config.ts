import { join, resolve } from 'node:path'
import type { Logger } from '@faasjs/node-utils'
import { loadConfig } from '@faasjs/node-utils'

export type ServerConfig = {
  root: string
  base: string
  staging: string
}

export function resolveFaasStaging(): string {
  return process.env.FaasEnv || 'development'
}

export function resolveServerConfig(
  root: string,
  logger?: Logger,
  defaultBase = '/',
): ServerConfig {
  const projectRoot = resolve(root)
  const staging = resolveFaasStaging()
  const srcRoot = join(projectRoot, 'src')
  const config = loadConfig(srcRoot, join(srcRoot, 'index.func.ts'), staging, logger)
  const server =
    config && typeof config === 'object'
      ? ((config as Record<string, any>).server as Record<string, any>)
      : undefined

  return {
    root:
      typeof server?.root === 'string' && server.root.length
        ? resolve(projectRoot, server.root)
        : projectRoot,
    base: typeof server?.base === 'string' && server.base.length ? server.base : defaultBase,
    staging,
  }
}
