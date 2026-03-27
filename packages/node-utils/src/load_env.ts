import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadEnvFile } from 'node:process'

/**
 * Options for {@link loadEnvFileIfExists}.
 */
export type LoadEnvFileIfExistsOptions = {
  cwd?: string
  filename?: string
}

/**
 * Load a dotenv file if it exists.
 *
 * - Defaults to `${process.cwd()}/.env`.
 * - Existing environment variables are preserved (Node.js behavior).
 *
 * @param options - Optional working directory and filename overrides.
 * @param options.cwd - Working directory used to resolve the dotenv file.
 * @param options.filename - Env filename relative to `cwd`. Defaults to `.env`.
 *
 * @example
 * ```ts
 * import { loadEnvFileIfExists } from '@faasjs/node-utils'
 *
 * loadEnvFileIfExists({
 *   cwd: process.cwd(),
 *   filename: '.env.local',
 * })
 * ```
 */
export function loadEnvFileIfExists(options: LoadEnvFileIfExistsOptions = {}): string | null {
  const filePath = resolve(options.cwd || process.cwd(), options.filename || '.env')

  if (!existsSync(filePath)) return null

  loadEnvFile(filePath)

  return filePath
}
