import type { Func, Plugin } from '@faasjs/core'

import { deepMerge } from './deep_merge'
import { type FuncConfig, type FuncPluginConfig, loadConfig } from './load_config'
import type { Logger } from './logger'

type PluginConstructor = new (config?: any) => Plugin

export type LoadPluginsOptions = {
  root: string
  filename: string
  staging: string
  logger?: Logger
}

function isPluginConstructor(value: unknown): value is PluginConstructor {
  if (typeof value !== 'function') return false

  const prototype = (value as any).prototype

  if (!prototype || typeof prototype !== 'object') return false

  return typeof prototype.onMount === 'function' || typeof prototype.onInvoke === 'function'
}

/**
 * Load staged `faas.yaml`, attach the merged config to a function, and
 * instantiate any plugins declared in YAML that are not already injected in code.
 *
 * Only `http` is treated as a built-in plugin. Other config-driven plugins must
 * declare an explicit module `type` whose default export is a lifecycle plugin
 * constructor.
 */
export async function loadPlugins<TFunc extends Func>(
  func: TFunc,
  options: LoadPluginsOptions,
): Promise<TFunc> {
  if (!func.config || typeof func.config !== 'object') func.config = Object.create(null)

  const loadedConfig = loadConfig(options.root, options.filename, options.staging, options.logger)
  const pluginConfigs: Record<string, FuncPluginConfig> =
    loadedConfig && typeof loadedConfig.plugins === 'object'
      ? loadedConfig.plugins
      : Object.create(null)
  const inlinePluginConfigs: Record<string, FuncPluginConfig> =
    typeof func.config.plugins === 'object'
      ? (func.config.plugins as Record<string, FuncPluginConfig>)
      : Object.create(null)

  if (Array.isArray(func.plugins)) {
    const plugins = func.plugins

    for (const pluginName in pluginConfigs) {
      if (!Object.hasOwn(pluginConfigs, pluginName)) continue
      if (plugins.find((plugin) => plugin.name === pluginName)) continue

      const pluginConfig = deepMerge(
        pluginConfigs[pluginName],
        inlinePluginConfigs[pluginName],
      ) as FuncPluginConfig

      if (!pluginConfig || typeof pluginConfig !== 'object')
        throw Error(
          `[loadPlugins] Invalid config for plugin "${pluginName}". Use an object entry in faas.yaml.`,
        )

      const pluginType =
        typeof pluginConfig.type === 'string' && pluginConfig.type.length
          ? pluginConfig.type
          : pluginName === 'http'
            ? 'http'
            : undefined

      let plugin: Plugin

      if (pluginType === 'http') {
        const mod = await import('@faasjs/core')

        if (typeof mod.Http !== 'function')
          throw Error('[loadPlugins] Failed to load built-in "http" plugin from "@faasjs/core".')

        plugin = new mod.Http({
          ...pluginConfig,
          name: pluginName,
          type: 'http',
        })
      } else {
        if (!pluginType)
          throw Error(
            `[loadPlugins] Plugin "${pluginName}" requires an explicit "type" in faas.yaml.`,
          )

        if (pluginType.startsWith('.') || pluginType.startsWith('..'))
          throw Error(
            `[loadPlugins] Relative plugin type "${pluginType}" for plugin "${pluginName}" is not supported. Use a package specifier, a file:// URL in faas.yaml, or inject the plugin in code.`,
          )

        let mod: any

        try {
          mod = await import(pluginType)
        } catch (error: any) {
          throw Error(
            `[loadPlugins] Failed to load plugin "${pluginName}" from "${pluginType}": ${error.message}`,
          )
        }

        if (!isPluginConstructor(mod.default))
          throw Error(
            `[loadPlugins] Plugin "${pluginName}" from "${pluginType}" must default export a lifecycle plugin class.`,
          )

        try {
          plugin = new mod.default({
            ...pluginConfig,
            name: pluginName,
            type: pluginType,
          })
        } catch (error: any) {
          throw Error(
            `[loadPlugins] Failed to initialize plugin "${pluginName}" from "${pluginType}": ${error.message}`,
          )
        }
      }

      if (!plugin || typeof plugin !== 'object')
        throw Error(`[loadPlugins] Invalid plugin instance for "${pluginName}".`)

      const runHandlerIndex = plugins.findIndex(
        (item) => item.type === 'handler' && item.name === 'handler',
      )

      if (runHandlerIndex === -1) plugins.push(plugin)
      else plugins.splice(runHandlerIndex, 0, plugin)
    }
  }

  const mergedConfig = deepMerge(loadedConfig, func.config) as FuncConfig

  if (func.config && typeof func.config === 'object') {
    for (const key of Object.keys(func.config)) delete func.config[key]

    Object.assign(func.config, mergedConfig)
  } else func.config = mergedConfig

  return func
}
