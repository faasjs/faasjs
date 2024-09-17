import { deepMerge } from '@faasjs/deep_merge'
import { existsSync, readFileSync } from 'node:fs'
import { sep, dirname, join } from 'node:path'
import { load } from 'js-yaml'
import type { Config as FuncConfig } from '@faasjs/func'

/**
 * 配置类
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

  /**
   * 创建配置类，并自动读取配置内容
   *
   * @param root {string} 根目录
   * @param filename {filename} 目标文件，用于读取目录层级
   */
  constructor(root: string, filename: string) {
    this.root = root

    if (!this.root.endsWith(sep)) this.root += sep

    this.filename = filename

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
        this[key] = deepMerge(this.origin.defaults, this.origin[key])

      const data = this[key]

      if (data.plugins)
        for (const pluginKey in data.plugins) {
          const plugin = data.plugins[pluginKey]
          plugin.name = pluginKey
        }
    }
  }
}

/**
 * 加载配置
 * @param root {string} 根目录
 * @param filename {filename} 目标文件，用于读取目录层级
 */
export function loadConfig(
  root: string,
  filename: string,
  staging: string
): Config {
  return new Config(root, filename)[staging] || Object.create(null)
}
