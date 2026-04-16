import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'

import * as z from 'zod'

import { deepMerge } from './deep_merge'
import { Logger } from './logger'
import { parseYaml } from './parse_yaml'

type YamlConfig = Record<string, FuncConfig>

/**
 * Per-plugin configuration entry resolved from `faas.yaml`.
 */
export type FuncPluginConfig = {
  [key: string]: any
  /**
   * Plugin type identifier consumed by the runtime or plugin loader.
   */
  type?: string
  /**
   * Plugin-specific configuration payload.
   */
  config?: {
    [key: string]: any
  }
  /**
   * Plugin key assigned during config resolution.
   */
  name?: string
}

/**
 * Resolved stage config merged from matching `faas.yaml` files.
 */
export type FuncConfig = {
  [key: string]: any
  /**
   * Named plugin configs keyed by plugin name.
   */
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

function normalizePluginTypeFromYaml(filePath: string, pluginType: string): string {
  const normalizedType = pluginType.startsWith('npm:') ? pluginType.slice(4) : pluginType

  if (normalizedType.startsWith('file://./') || normalizedType.startsWith('file://../'))
    return pathToFileURL(resolve(dirname(filePath), normalizedType.slice('file://'.length))).href

  if (normalizedType.startsWith('./') || normalizedType.startsWith('../'))
    return pathToFileURL(resolve(dirname(filePath), normalizedType)).href

  return normalizedType
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

  const data = result.data as YamlConfig

  for (const stageName in data) {
    const stage = data[stageName]

    if (!stage?.plugins) continue

    for (const pluginName in stage.plugins) {
      const plugin = stage.plugins[pluginName]

      if (typeof plugin?.type === 'string')
        plugin.type = normalizePluginTypeFromYaml(filePath, plugin.type)
    }
  }

  return data
}

/**
 * Copy each plugin map key onto the corresponding plugin config as `name`.
 *
 * @param {FuncConfig} config - Config object whose `plugins` entries are updated in place.
 * @returns {void} No return value.
 * @example
 * ```ts
 * const config: FuncConfig = {
 *   plugins: {
 *     http: {},
 *   },
 * }
 *
 * assignPluginNames(config)
 * ```
 */
export function assignPluginNames(config: FuncConfig): void {
  if (!config.plugins) return

  for (const pluginKey in config.plugins) {
    const plugin = config.plugins[pluginKey]
    if (!plugin || typeof plugin !== 'object') continue
    plugin.name = pluginKey
  }
}

/**
 * Read and merge staged `faas.yaml` config for a function file.
 *
 * This helper backs {@link loadConfig} when callers need to inspect multiple stages from one reader.
 *
 * @example
 * ```ts
 * const config = new Config(process.cwd(), '/project/src/orders/create.func.ts')
 *
 * const development = config.get('development')
 * ```
 */
export class Config {
  [key: string]: any
  /**
   * Project root used while walking for `faas.yaml` files.
   */
  public readonly root: string
  /**
   * Function filename used to derive nested config scopes.
   */
  public readonly filename: string
  /**
   * Raw merged config tree keyed by stage name.
   */
  public readonly origin: {
    [key: string]: FuncConfig
    defaults: FuncConfig
  }
  /**
   * Default config merged into every stage.
   */
  public readonly defaults: FuncConfig
  private logger: Logger

  /**
   * Build a config reader for a function path.
   *
   * @param {string} root - Project root directory.
   * @param {string} filename - Function filename used to resolve nested scopes.
   * @param {Logger} [logger] - Optional logger used for debug output.
   */
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

  /**
   * Resolve config for a staging key, falling back to defaults.
   *
   * @param {string} key - Staging name such as `development` or `production`.
   * @returns {FuncConfig} Resolved stage config.
   */
  public get(key: string): FuncConfig {
    return this[key] || this.defaults || Object.create(null)
  }
}

/**
 * Resolve the staged `faas.yaml` config for a function file.
 *
 * This walks from `root` to the function directory, merges every discovered `faas.yaml`,
 * applies the `defaults` stage, and annotates plugin entries with their resolved `name`.
 *
 * @param {string} root - Project root directory used to scope config discovery.
 * @param {string} filename - Function filename whose directory controls nested config lookup.
 * @param {string} staging - Staging name to resolve.
 * @param {Logger} [logger] - Optional logger used while loading config files.
 * @returns {FuncConfig} Resolved config for the requested staging.
 * @throws {Error} If a discovered `faas.yaml` cannot be parsed or fails schema validation.
 *
 * @example
 * ```ts
 * import { loadConfig } from '@faasjs/node-utils'
 *
 * const config = loadConfig(
 *   process.cwd(),
 *   '/project/src/orders/create.func.ts',
 *   'development',
 * )
 * ```
 */
export function loadConfig(
  root: string,
  filename: string,
  staging: string,
  logger?: Logger,
): FuncConfig {
  return new Config(root, filename, logger).get(staging)
}
