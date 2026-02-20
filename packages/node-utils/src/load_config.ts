import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'
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

function isObject(value: unknown): value is Record<string, any> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function createConfigError(filePath: string, keyPath: string, reason: string): Error {
  return Error(`[loadConfig] Invalid faas.yaml ${filePath} at "${keyPath}": ${reason}`)
}

function validateServerConfig(filePath: string, staging: string, server: unknown): void {
  if (!isObject(server)) throw createConfigError(filePath, `${staging}.server`, 'must be an object')

  if (typeof server.root !== 'undefined' && typeof server.root !== 'string')
    throw createConfigError(filePath, `${staging}.server.root`, 'must be a string')

  if (typeof server.base !== 'undefined' && typeof server.base !== 'string')
    throw createConfigError(filePath, `${staging}.server.base`, 'must be a string')
}

function validateFaasYaml(filePath: string, config: unknown): YamlConfig {
  if (typeof config === 'undefined' || config === null) return Object.create(null)

  if (!isObject(config)) throw createConfigError(filePath, '<root>', 'must be an object')

  for (const staging in config) {
    if (staging === 'types')
      throw createConfigError(
        filePath,
        'types',
        'has been removed, move related settings out of faas.yaml',
      )

    const stageConfig = config[staging]

    if (typeof stageConfig === 'undefined' || stageConfig === null) continue

    if (!isObject(stageConfig)) throw createConfigError(filePath, staging, 'must be an object')

    if (Object.hasOwn(stageConfig, 'types'))
      throw createConfigError(
        filePath,
        `${staging}.types`,
        'has been removed, move related settings out of faas.yaml',
      )

    if (Object.hasOwn(stageConfig, 'server'))
      validateServerConfig(filePath, staging, stageConfig.server)
  }

  return config
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
