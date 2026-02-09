import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { Logger } from '@faasjs/logger'
import { getRootPath } from '../../helper'

const logger = new Logger('Cli:new')

export function normalizePath(name: string): string {
  const normalized = name.replaceAll('\\', '/').replace(/^\/+|\/+$/g, '')

  if (!normalized) throw Error('Path is required')
  if (normalized.includes('..')) throw Error('Path cannot include ..')

  return normalized
}

export function getPagesPath(): string {
  return join(getRootPath(), 'src', 'pages')
}

export function ensureDirectory(path: string): void {
  if (!existsSync(path)) mkdirSync(path, { recursive: true })
}

export function writeFile(path: string, content: string): void {
  const folder = dirname(path)
  ensureDirectory(folder)

  if (existsSync(path)) throw Error(`File already exists: ${path}`)

  writeFileSync(path, content)
  logger.info('Created %s', path)
}

export function toRouteKey(filepath: string): string {
  return filepath.replace(/\.func\.ts$/, '').replaceAll('\\', '/')
}
