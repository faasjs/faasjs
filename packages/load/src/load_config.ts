import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, sep } from 'node:path'
import { deepMerge } from '@faasjs/deep_merge'
import type { Config as FuncConfig } from '@faasjs/func'
import { Logger } from '@faasjs/logger'
import { load } from 'js-yaml'

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

    const paths = [this.root, '.'].concat(
      dirname(filename.replace(root, '')).split(sep)
    )

    paths.reduce((base: string, path: string) => {
      const root = join(base, path)
      if (root === base) return base

      const faas = join(root, 'faas.yaml')

      if (existsSync(faas))
        configs.push(
          load(readFileSync(faas).toString()) as { [key: string]: FuncConfig }
        )

      return root
    })

    this.origin = deepMerge(...configs)

    this.defaults = deepMerge(this.origin.defaults || {})

    for (const key in this.origin) {
      if (key !== 'defaults')
        this[key] = deepMerge(this.defaults, this.origin[key])

      const data = this[key]

      if (data.plugins)
        for (const pluginKey in data.plugins) {
          const plugin = data.plugins[pluginKey]
          plugin.name = pluginKey
        }
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
  logger?: Logger
): FuncConfig {
  return new Config(root, filename, logger).get(staging)
}
