import { existsSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'
import { loadEnvFile } from 'node:process'

/**
 * Resolve the `.env` file path for a given app source root.
 *
 * When a `faas.yaml` is found in the app source root, the `.env` file is resolved from
 * the parent directory. Otherwise it is expected alongside the source root.
 *
 * @param {string} root - Normalized app source root directory.
 * @returns {string} Resolved `.env` file path.
 */
export function resolveEnvFilePath(root: string): string {
  const normalizedRoot = root.endsWith(sep) ? root.slice(0, -1) : root
  const parentRoot = dirname(normalizedRoot)

  if (existsSync(join(normalizedRoot, 'faas.yaml'))) return join(parentRoot, '.env')

  return join(normalizedRoot, '.env')
}

/**
 * Load server environment variables from `.env` into `process.env`.
 *
 * Resolves the `.env` file via {@link resolveEnvFilePath} and calls the built-in
 * `process.loadEnvFile`. Failures are logged as warnings and do not halt initialization.
 *
 * @param {string} root - Normalized app source root directory.
 * @returns {void} No return value.
 */
export function loadServerEnvFile(root: string): void {
  const envFile = resolveEnvFilePath(root)
  if (!existsSync(envFile)) return

  try {
    loadEnvFile(envFile)
  } catch (error) {
    console.warn('[faasjs] Failed to load env file', error)
  }
}
