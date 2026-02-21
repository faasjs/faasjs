/**
 * FaasJS core package.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/core.svg)](https://github.com/faasjs/faasjs/blob/main/packages/core/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/core.svg)](https://www.npmjs.com/package/@faasjs/core)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/core
 * ```
 *
 * @packageDocumentation
 */

import type { output, ZodError, ZodTypeAny } from 'zod'
import * as z from 'zod'
import type { Config, Handler, InvokeData, Plugin } from './func'
import { Func } from './func'
import { HttpError } from './http'
import type { Knex as FaasKnex } from './knex/plugin'

export { z }
export * from './func'
export {
  ContentType,
  Cookie,
  Http,
  HttpError,
  type HttpConfig,
  type Response,
  Session,
  useHttp,
  type CookieOptions,
  type SessionContent,
  type SessionOptions,
} from './http'
export {
  type Middleware,
  type MiddlewareContext,
  type MiddlewareEvent,
  staticHandler,
  useMiddleware,
  useMiddlewares,
  type StaticHandlerOptions,
} from './middleware'
export {
  createCronJob,
  CronJob,
  listCronJobs,
  removeCronJob,
  type CronJobContext,
  type CronJobErrorHandler,
  type CronJobHandler,
  type CronJobOptions,
} from './cron'
export { closeAll, getAll, Server, type ServerHandlerOptions, type ServerOptions } from './server'
export * from './knex'

type ZodSchema = ZodTypeAny
type KnexQuery = FaasKnex['query']
type PluginConstructor = new (config?: any) => Plugin
type KnexPlugin = Plugin & { query?: KnexQuery }
type PluginConfigValue = {
  [key: string]: any
  name?: string
  type?: string
}
type RawPluginConfig = PluginConfigValue | string | undefined
type ResolvedPluginConfig = {
  configValue: PluginConfigValue
  pluginName: string
  pluginType: string
}

type CoreMountData<TEvent = any, TContext = any> = {
  event: TEvent
  context: TContext
  config?: Config
  logger?: any
}

export type DefineApiData<
  TSchema extends ZodSchema | undefined = undefined,
  TEvent = any,
  TContext = any,
  TResult = any,
> = InvokeData<TEvent, TContext, TResult> & {
  params: TSchema extends ZodSchema ? output<NonNullable<TSchema>> : Record<string, never>
  knex: KnexQuery | undefined
}

export type DefineApiOptions<
  TSchema extends ZodSchema | undefined = undefined,
  TEvent = any,
  TContext = any,
  TResult = any,
> = {
  schema?: TSchema
  handler: (data: DefineApiData<TSchema, TEvent, TContext, TResult>) => Promise<TResult>
}

function formatPluginModuleName(type: string): string {
  const normalizedType = type.startsWith('npm:') ? type.slice(4) : type

  if (
    normalizedType === 'http' ||
    normalizedType === '@faasjs/http' ||
    normalizedType === 'knex' ||
    normalizedType === '@faasjs/knex'
  )
    return '@faasjs/core'

  if (
    normalizedType.startsWith('@') ||
    normalizedType.startsWith('.') ||
    normalizedType.startsWith('/') ||
    normalizedType.includes(':')
  )
    return normalizedType

  return `@faasjs/${normalizedType}`
}

function formatPluginClassName(type: string): string {
  return type
    .replace(/^@[^/]+\//, '')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((item) => item.slice(0, 1).toUpperCase() + item.slice(1))
    .join('')
}

function isPluginConstructor(value: unknown): value is PluginConstructor {
  if (typeof value !== 'function') return false

  const prototype = (value as any).prototype

  if (!prototype || typeof prototype !== 'object') return false

  return typeof prototype.onMount === 'function' || typeof prototype.onInvoke === 'function'
}

function normalizeIssueMessage(message: string): string {
  return message.replace(': expected', ', expected').replace(/>=\s+/g, '>=').replace(/<=\s+/g, '<=')
}

function formatZodErrorMessage(error: ZodError): string {
  const lines = ['Invalid params']

  for (const issue of error.issues) {
    const path = issue.path.length ? issue.path.map((item) => String(item)).join('.') : '<root>'

    lines.push(`${path}: ${normalizeIssueMessage(issue.message)}`)
  }

  return lines.join('\n')
}

function findPluginByType<TPlugin extends Plugin = Plugin>(
  func: Func,
  type: string,
): TPlugin | undefined {
  return func.plugins.find((plugin) => plugin.type === type) as TPlugin | undefined
}

function resolvePluginConfig(key: string, rawConfig: RawPluginConfig): ResolvedPluginConfig {
  const configValue =
    rawConfig && typeof rawConfig === 'object'
      ? Object.assign(Object.create(null), rawConfig)
      : Object.create(null)

  const pluginName =
    typeof configValue.name === 'string' && configValue.name.length ? configValue.name : key

  const pluginType =
    (typeof configValue.type === 'string' && configValue.type) ||
    (typeof rawConfig === 'string' && rawConfig) ||
    key

  return {
    configValue,
    pluginName,
    pluginType,
  }
}

class CoreFunc<TEvent = any, TContext = any, TResult = any> extends Func<
  TEvent,
  TContext,
  TResult
> {
  private loadedConfigPlugins = false

  private insertPluginBeforeRunHandler(plugin: Plugin): void {
    const index = this.plugins.findIndex(
      (item) => item.type === 'handler' && item.name === 'handler',
    )

    if (index === -1) this.plugins.push(plugin)
    else this.plugins.splice(index, 0, plugin)
  }

  private async resolvePluginConstructor(
    moduleName: string,
    className: string,
    pluginName: string,
  ): Promise<PluginConstructor> {
    let mod: any

    try {
      mod = await import(moduleName)
    } catch (error: any) {
      throw Error(
        `[defineApi] Failed to load plugin "${pluginName}" from "${moduleName}": ${error.message}`,
      )
    }

    if (className && isPluginConstructor(mod[className])) return mod[className]

    if (isPluginConstructor(mod.default)) return mod.default

    throw Error(
      `[defineApi] Failed to resolve plugin class "${className}" from "${moduleName}" for plugin "${pluginName}". Supported exports are named class "${className}" or default class export.`,
    )
  }

  private async loadPluginsFromConfig(config: Config): Promise<void> {
    const pluginConfigs = (config.plugins || Object.create(null)) as Record<string, RawPluginConfig>

    for (const key in pluginConfigs) {
      if (!Object.hasOwn(pluginConfigs, key)) continue

      const rawConfig = pluginConfigs[key]
      const { configValue, pluginName, pluginType } = resolvePluginConfig(key, rawConfig)

      if (this.plugins.find((plugin) => plugin.name === pluginName)) continue

      const moduleName = formatPluginModuleName(pluginType)
      const className = formatPluginClassName(pluginType)
      const PluginConstructor = await this.resolvePluginConstructor(
        moduleName,
        className,
        pluginName,
      )

      let plugin: Plugin

      try {
        plugin = new PluginConstructor({
          ...configValue,
          name: pluginName,
          type: pluginType,
        })
      } catch (error: any) {
        throw Error(
          `[defineApi] Failed to initialize plugin "${pluginName}" from "${moduleName}": ${error.message}`,
        )
      }

      if (!plugin || typeof plugin !== 'object')
        throw Error(`[defineApi] Invalid plugin instance for "${pluginName}" from "${moduleName}".`)

      this.insertPluginBeforeRunHandler(plugin)
    }

    this.loadedConfigPlugins = true
  }

  public override async mount(
    data: CoreMountData<TEvent, TContext> = {
      event: Object.create(null) as TEvent,
      context: Object.create(null) as TContext,
    },
  ): Promise<void> {
    if (!data.config) data.config = this.config

    if (!this.loadedConfigPlugins) await this.loadPluginsFromConfig(data.config)

    await super.mount(data)
  }
}

/**
 * Create an HTTP API function with optional Zod validation.
 *
 * Plugins are always auto-loaded from `func.config.plugins`.
 * Plugin module exports must be either a named class (normalized from
 * plugin type) or a default class export.
 *
 * The `http` plugin is required.
 */
export function defineApi<
  TSchema extends ZodSchema | undefined = undefined,
  TEvent = any,
  TContext = any,
  TResult = any,
>(options: DefineApiOptions<TSchema, TEvent, TContext, TResult>): Func<TEvent, TContext, TResult> {
  let func: CoreFunc<TEvent, TContext, TResult>
  type Params = DefineApiData<TSchema, TEvent, TContext, TResult>['params']

  let pluginRefsResolved = false
  let hasHttp = false
  let knexQuery: KnexQuery | undefined

  const parseParams = async (event: TEvent): Promise<Params> => {
    if (!pluginRefsResolved) {
      hasHttp = !!findPluginByType(func, 'http')
      knexQuery = findPluginByType<KnexPlugin>(func, 'knex')?.query
      pluginRefsResolved = true
    }

    if (!hasHttp)
      throw Error(
        '[defineApi] Missing required "http" plugin. Please configure it in func.config.plugins.',
      )

    if (!options.schema) return {} as Params

    const result = await options.schema.safeParseAsync((event as any)?.params ?? {})

    if (!result.success)
      throw new HttpError({
        statusCode: 400,
        message: formatZodErrorMessage(result.error),
      })

    return result.data as Params
  }

  const invokeHandler: Handler<TEvent, TContext, TResult> = async (data) => {
    const params = await parseParams(data.event)

    const invokeData = {
      ...data,
      params,
      knex: knexQuery,
    } as DefineApiData<TSchema, TEvent, TContext, TResult>

    return options.handler(invokeData)
  }

  func = new CoreFunc<TEvent, TContext, TResult>({
    plugins: [],
    handler: invokeHandler,
  })

  return func
}
