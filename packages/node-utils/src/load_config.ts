import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'

import * as z from 'zod'

import { deepMerge } from './deep_merge'
import { Logger } from './logger'
import { parseYaml } from './parse_yaml'

type YamlConfig = {
  [key: string]: any
}

export type FuncPluginConfig = {
  [key: string]: any
  type?: string
  config?: {
    [key: string]: any
  }
  name?: string
}

export type FuncConfig = {
  [key: string]: any
  plugins?: {
    [key: string]: FuncPluginConfig
  }
}

const serverConfigSchema = z.looseObject({
  root: z.string().optional(),
  base: z.string().optional(),
})

const stageConfigSchema = z.looseObject({
  server: serverConfigSchema.optional(),
})

const faasYamlSchema = z.object({}).catchall(stageConfigSchema)

function createConfigError(filePath: string, keyPath: string, reason: string): Error {
  return Error(`[loadConfig] Invalid faas.yaml ${filePath} at "${keyPath}": ${reason}`)
}

function formatIssuePath(path: PropertyKey[]): string {
  return path.map((value) => String(value)).join('.')
}

function validateFaasYaml(filePath: string, config: unknown): YamlConfig {
  if (typeof config === 'undefined') return Object.create(null)

  const result = faasYamlSchema.safeParse(config)

  if (!result.success) {
    const issue = result.error.issues[0]!

    throw createConfigError(
      filePath,
      issue.path.length ? formatIssuePath(issue.path) : '<root>',
      issue.message,
    )
  }

  return result.data
}

function assignPluginNames(config: FuncConfig): void {
  if (!config.plugins) return

  for (const pluginKey in config.plugins) {
    const plugin = config.plugins[pluginKey]
    plugin.name = pluginKey
  }
}

/**
 * Load configuration from faas.yaml
 */
export class Config {
  [key: string]: any
  public readonly root: string
  public readonly filename: string
  public readonly origin: {
    [key: string]: FuncConfig
    defaults: FuncConfig
  }
  public readonly defaults: FuncConfig
  private logger: Logger

  constructor(root: string, filename: string, logger?: Logger) {
    this.logger = new Logger(logger?.label ? `${logger.label}] [config` : 'config')

    this.root = root

    if (!this.root.endsWith(sep)) this.root += sep

    this.filename = filename

    this.logger.debug('load %s in %s', filename, root)

    const configs: { [key: string]: FuncConfig }[] = []

    const paths = [this.root, '.'].concat(dirname(filename.replace(root, '')).split(sep))

    let base = paths[0]
    for (const path of paths.slice(1)) {
      const currentRoot = join(base, path)
      if (currentRoot === base) continue

      const faas = join(currentRoot, 'faas.yaml')
      if (existsSync(faas))
        configs.push(validateFaasYaml(faas, parseYaml(readFileSync(faas, 'utf8'))))

      base = currentRoot
    }

    this.origin = deepMerge(...configs)

    this.defaults = deepMerge(this.origin.defaults || {})

    for (const key in this.origin) {
      const data = key === 'defaults' ? this.defaults : deepMerge(this.defaults, this.origin[key])

      if (key !== 'defaults') this[key] = data

      assignPluginNames(data)
    }
  }

  public get(key: string): FuncConfig {
    return this[key] || this.defaults || Object.create(null)
  }
}

/**
 * Load configuration from faas.yaml
 */
export function loadConfig(
  root: string,
  filename: string,
  staging: string,
  logger?: Logger,
): FuncConfig {
  return new Config(root, filename, logger).get(staging)
}
