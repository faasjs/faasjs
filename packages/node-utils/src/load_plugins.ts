import { basename, dirname, extname, isAbsolute, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { type Func, type Plugin } from '@faasjs/core'

import { deepMerge } from './deep_merge'
import {
  assignPluginNames,
  type FuncConfig,
  type FuncPluginConfig,
  loadConfig,
} from './load_config'
import type { Logger } from './logger'

type PluginConstructor = new (config?: any) => Plugin

type ConfigurablePlugin = Plugin & {
  config?: Record<string, any>
  applyConfig?: (config: FuncPluginConfig) => void | Promise<void>
}

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

function stripNpmPrefix(specifier: string): string {
  return specifier.startsWith('npm:') ? specifier.slice(4) : specifier
}

function hasUrlScheme(specifier: string): boolean {
  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(specifier)
}

function normalizePluginType(pluginType: string, filename: string): string {
  const normalizedType = stripNpmPrefix(pluginType)

  if (normalizedType.startsWith('file://./') || normalizedType.startsWith('file://../'))
    return pathToFileURL(resolve(dirname(filename), normalizedType.slice('file://'.length))).href

  if (normalizedType.startsWith('./') || normalizedType.startsWith('../'))
    return pathToFileURL(resolve(dirname(filename), normalizedType)).href

  if (isAbsolute(normalizedType)) return pathToFileURL(resolve(normalizedType)).href

  return normalizedType
}

function resolvePluginModuleSpecifier(pluginType: string): string {
  if (pluginType === 'http' || pluginType === '@faasjs/http') return '@faasjs/core'

  if (
    !pluginType.startsWith('.') &&
    !pluginType.startsWith('/') &&
    !pluginType.startsWith('@') &&
    !pluginType.startsWith('file://') &&
    !hasUrlScheme(pluginType)
  )
    return `@faasjs/${pluginType}`

  return pluginType
}

function toPascalCase(value: string): string {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function getPluginExportCandidates(pluginType: string): string[] {
  const candidates = new Set<string>()
  const normalizedType = stripNpmPrefix(pluginType)
  let source = normalizedType

  if (normalizedType.startsWith('file://')) {
    try {
      const filePath = fileURLToPath(normalizedType)
      source = basename(filePath, extname(filePath))
    } catch {}
  } else if (isAbsolute(normalizedType)) source = basename(normalizedType, extname(normalizedType))
  else {
    const trimmed = normalizedType.replace(/\/+$/, '')
    const parts = trimmed.split('/')
    source = parts[parts.length - 1] || trimmed

    if (source === 'index' && parts.length > 1) source = parts[parts.length - 2] || source
  }

  const pascal = toPascalCase(source.replace(/^@/, ''))

  if (pascal) {
    candidates.add(pascal)
    if (!pascal.endsWith('Plugin')) candidates.add(`${pascal}Plugin`)
  }

  return [...candidates]
}

function resolvePluginConstructor(mod: any, pluginType: string): PluginConstructor | undefined {
  for (const candidate of getPluginExportCandidates(pluginType)) {
    if (isPluginConstructor(mod?.[candidate])) return mod[candidate]

    if (isPluginConstructor(mod?.default?.[candidate])) return mod.default[candidate]
  }

  if (isPluginConstructor(mod?.default)) return mod.default

  return
}

function normalizeMergedPluginConfig(
  pluginId: string,
  pluginConfig: FuncPluginConfig,
  filename: string,
): FuncPluginConfig {
  const normalizedConfig = deepMerge(pluginConfig) as FuncPluginConfig

  if (!normalizedConfig || typeof normalizedConfig !== 'object') return normalizedConfig

  normalizedConfig.name = pluginId

  if (typeof normalizedConfig.type === 'string' && normalizedConfig.type.length)
    normalizedConfig.type = normalizePluginType(normalizedConfig.type, filename)

  return normalizedConfig
}

async function applyPluginConfig(plugin: Plugin, pluginConfig: FuncPluginConfig): Promise<void> {
  const configurablePlugin = plugin as ConfigurablePlugin

  if (typeof configurablePlugin.applyConfig === 'function') {
    await configurablePlugin.applyConfig(pluginConfig)
    return
  }

  const nextConfig = pluginConfig.config
  const currentConfig =
    configurablePlugin.config && typeof configurablePlugin.config === 'object'
      ? configurablePlugin.config
      : undefined

  if (typeof nextConfig === 'undefined' && typeof currentConfig === 'undefined') return

  configurablePlugin.config = deepMerge(currentConfig || Object.create(null), nextConfig)
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
  const resolvedPluginIds = new Set([
    ...Object.keys(pluginConfigs),
    ...Object.keys(inlinePluginConfigs),
  ])

  if (Array.isArray(func.plugins)) {
    const plugins = func.plugins

    for (const pluginId of resolvedPluginIds) {
      const pluginConfig = normalizeMergedPluginConfig(
        pluginId,
        deepMerge(pluginConfigs[pluginId], inlinePluginConfigs[pluginId]) as FuncPluginConfig,
        options.filename,
      )

      if (!pluginConfig || typeof pluginConfig !== 'object')
        throw Error(
          `[loadPlugins] Invalid config for plugin "${pluginId}". Use an object entry in faas.yaml.`,
        )

      const pluginType =
        typeof pluginConfig.type === 'string' && pluginConfig.type.length
          ? pluginConfig.type
          : pluginId === 'http'
            ? 'http'
            : undefined

      if (!pluginType)
        throw Error(`[loadPlugins] Plugin "${pluginId}" requires an explicit "type" in faas.yaml.`)

      const existingPlugin = plugins.find((plugin) => plugin.name === pluginId)

      if (existingPlugin) {
        await applyPluginConfig(existingPlugin, pluginConfig)
        continue
      }

      const moduleSpecifier = resolvePluginModuleSpecifier(pluginType)

      let mod: any

      try {
        mod = await import(moduleSpecifier)
      } catch (error: any) {
        throw Error(
          `[loadPlugins] Failed to load plugin "${pluginId}" from "${pluginType}": ${error.message}`,
        )
      }

      const PluginClass = resolvePluginConstructor(mod, pluginType)

      if (!PluginClass)
        throw Error(
          `[loadPlugins] Plugin "${pluginId}" from "${pluginType}" must export a lifecycle plugin class.`,
        )

      let plugin: Plugin

      try {
        plugin = new PluginClass({
          ...pluginConfig,
          name: pluginId,
          type: pluginType,
        })
      } catch (error: any) {
        throw Error(
          `[loadPlugins] Failed to initialize plugin "${pluginId}" from "${pluginType}": ${error.message}`,
        )
      }

      if (!plugin || typeof plugin !== 'object')
        throw Error(`[loadPlugins] Invalid plugin instance for "${pluginId}".`)

      const runHandlerIndex = plugins.findIndex(
        (item) => item.type === 'handler' && item.name === 'handler',
      )

      if (runHandlerIndex === -1) plugins.push(plugin)
      else plugins.splice(runHandlerIndex, 0, plugin)
    }
  }

  const mergedConfig = deepMerge(loadedConfig, func.config) as FuncConfig
  if (mergedConfig.plugins && typeof mergedConfig.plugins === 'object') {
    for (const pluginId in mergedConfig.plugins) {
      if (!Object.hasOwn(mergedConfig.plugins, pluginId)) continue

      const pluginConfig = mergedConfig.plugins[pluginId]
      if (!pluginConfig || typeof pluginConfig !== 'object') continue

      mergedConfig.plugins[pluginId] = normalizeMergedPluginConfig(
        pluginId,
        pluginConfig,
        options.filename,
      )
    }

    assignPluginNames(mergedConfig)
  }

  if (func.config && typeof func.config === 'object') {
    for (const key of Object.keys(func.config)) delete func.config[key]

    Object.assign(func.config, mergedConfig)
  } else func.config = mergedConfig

  return func
}
