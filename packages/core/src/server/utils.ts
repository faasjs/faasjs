import { existsSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'
import { loadEnvFile } from 'node:process'

export function resolveEnvFilePath(root: string): string {
  const normalizedRoot = root.endsWith(sep) ? root.slice(0, -1) : root
  const parentRoot = dirname(normalizedRoot)

  if (existsSync(join(normalizedRoot, 'faas.yaml'))) return join(parentRoot, '.env')

  return join(normalizedRoot, '.env')
}

export function loadServerEnvFile(root: string): void {
  const envFile = resolveEnvFilePath(root)
  if (!existsSync(envFile)) return

  try {
    loadEnvFile(envFile)
  } catch (error) {
    console.warn('[faasjs] Failed to load env file', error)
  }
}
