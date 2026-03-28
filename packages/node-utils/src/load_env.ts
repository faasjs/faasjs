import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadEnvFile } from 'node:process'

/**
 * Options for {@link loadEnvFileIfExists}.
 */
export type LoadEnvFileIfExistsOptions = {
  /**
   * Working directory used to resolve the env file path.
   *
   * @default process.cwd()
   */
  cwd?: string
  /**
   * Env filename relative to `cwd`.
   *
   * @default '.env'
   */
  filename?: string
}

/**
 * Load a dotenv file with Node's built-in `loadEnvFile` when the file exists.
 *
 * Existing `process.env` values are preserved because Node.js does not overwrite them.
 *
 * @param {LoadEnvFileIfExistsOptions} options - Optional working directory and filename overrides. @default {}
 * @returns {string | null} Resolved env file path, or `null` when the file does not exist.
 * @throws {Error} If the resolved path exists but cannot be read as a file.
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
