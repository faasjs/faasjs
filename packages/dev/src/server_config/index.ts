import { join, resolve } from 'node:path'

import type { Logger } from '@faasjs/node-utils'
import { loadConfig } from '@faasjs/node-utils'

/**
 * Resolved server settings derived from project files and runtime environment.
 */
export type ServerConfig = {
  /**
   * Absolute project root used to load source files.
   */
  root: string
  /**
   * URL base path stripped from incoming requests.
   */
  base: string
  /**
   * Active staging name resolved from {@link resolveFaasStaging}.
   */
  staging: string
}

/**
 * Resolve the active FaasJS staging name from the current environment.
 *
 * @returns `process.env.FaasEnv` or `'development'` when the variable is unset.
 */
export function resolveFaasStaging(): string {
  return process.env.FaasEnv || 'development'
}

/**
 * Resolve server root, base path, and staging for local FaasJS tooling.
 *
 * It loads `server` overrides from `src/faas.yaml` for the active staging and
 * falls back to the provided root and base when overrides are absent.
 *
 * @param {string} root - Project root passed by the caller.
 * @param {Logger} logger - Logger forwarded to `loadConfig`.
 * @param {string} defaultBase - Base path used when config does not define `server.base`. @default '/'
 * @returns Resolved server configuration for the current project.
 * @throws {Error} When `faas.yaml` cannot be loaded or contains invalid server config.
 */
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
