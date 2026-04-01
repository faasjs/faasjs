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
 */

import { fileURLToPath } from 'node:url'

import type { output, ZodError, ZodType } from 'zod'
import * as z from 'zod'

import type { Config, Handler, InvokeData, Plugin } from './func'
import { Func } from './func'
import { HttpError, type Cookie, type Session } from './plugins/http'

export { z }
export * from './func'
export * from './plugins/http'
export * from './middleware'
export * from './cron'
export * from './server'
export * from './utils'

type IsAny<T> = 0 extends 1 & T ? true : false
type DefineApiEventParams<TSchema extends ZodType | undefined = undefined> = TSchema extends ZodType
  ? output<NonNullable<TSchema>>
  : Record<string, any>
type DefineApiEvent<TSchema extends ZodType | undefined = undefined, TEvent = any> =
  IsAny<TEvent> extends true
    ? Record<string, any> & {
        params?: DefineApiEventParams<TSchema>
      }
    : TEvent
type PluginConstructor = new (config?: any) => Plugin
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

/**
 * Handler data passed to {@link defineApi}.
 *
 * Extends the normal invoke data with validated `params`, `cookie`, `session`,
 * and any plugin-provided fields declared through `DefineApiInject`.
 *
 * @template TSchema - Zod schema used to validate `event.params`.
 * @template TEvent - Raw event type passed to the function.
 * @template TContext - Runtime context type.
 * @template TResult - Handler return type.
 */
export type DefineApiData<
  TSchema extends ZodType | undefined = undefined,
  TEvent = any,
  TContext = any,
  TResult = any,
> = InvokeData<TEvent, TContext, TResult> & {
  /**
   * Params validated by the optional Zod schema.
   */
  params: TSchema extends ZodType ? output<NonNullable<TSchema>> : Record<string, never>
  /**
   * Cookie helper injected by the HTTP plugin.
   */
  cookie: Cookie
  /**
   * Session helper injected by the HTTP plugin.
   */
  session: Session
} & DefineApiInject

/**
 * API data augmentation map.
 *
 * Extend this interface in plugin packages to describe which data fields are
 * injected into `defineApi` handler arguments.
 */
export interface DefineApiInject extends Record<never, never> {}

/**
 * Options for creating a typed API function with {@link defineApi}.
 *
 * @template TSchema - Zod schema used to validate `event.params`.
 * @template TEvent - Raw event type passed to the function.
 * @template TContext - Runtime context type.
 * @template TResult - Handler return type.
 *
 */
export type DefineApiOptions<
  TSchema extends ZodType | undefined = undefined,
  TEvent = any,
  TContext = any,
  TResult = any,
> = {
  /**
   * Optional Zod schema used to validate `event.params`.
   */
  schema?: TSchema
  /**
   * Async business handler executed after plugin and schema setup.
   */
  handler: (data: DefineApiData<TSchema, TEvent, TContext, TResult>) => Promise<TResult>
}

function formatPluginModuleName(type: string): string {
  const normalizedType = type.startsWith('npm:') ? type.slice(4) : type

  if (normalizedType === 'http' || normalizedType === '@faasjs/http') return '@faasjs/core'

  if (
    normalizedType.startsWith('@') ||
    normalizedType.startsWith('.') ||
    normalizedType.startsWith('/') ||
    normalizedType.includes(':')
  )
    return normalizedType

  return `@faasjs/${normalizedType}`
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
    pluginType: string,
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

    const normalizedType = pluginType.startsWith('npm:') ? pluginType.slice(4) : pluginType
    const classNames: string[] = []
    const addClassName = (value: string): void => {
      const className = value
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map((item) => item.slice(0, 1).toUpperCase() + item.slice(1))
        .join('')

      if (!className || classNames.includes(className)) return

      classNames.push(className)
    }

    if (normalizedType.startsWith('@')) addClassName(normalizedType.replace(/^@[^/]+\//, ''))

    if (
      normalizedType.startsWith('file://') ||
      normalizedType.startsWith('.') ||
      normalizedType.startsWith('/') ||
      /^[A-Za-z]:[\\/]/.test(normalizedType)
    ) {
      let resolvedType = normalizedType

      if (resolvedType.startsWith('file://')) {
        try {
          resolvedType = fileURLToPath(resolvedType)
        } catch {}
      }

      const segments = resolvedType
        .split(/[\\/]+/)
        .filter(Boolean)
        .filter((segment) => segment !== '.')

      if (segments.length) {
        const normalizedSegments = [...segments]
        normalizedSegments[normalizedSegments.length - 1] = normalizedSegments[
          normalizedSegments.length - 1
        ]!.replace(/(\.d)?\.(?:[cm]?[jt]sx?)$/i, '')

        const maxDepth = Math.min(normalizedSegments.length, 3)

        for (let depth = maxDepth; depth >= 1; depth--) {
          addClassName(normalizedSegments.slice(-depth).join('/'))
        }

        if (normalizedSegments[normalizedSegments.length - 1] === 'index') {
          const baseSegments = normalizedSegments.slice(0, -1)
          const baseDepth = Math.min(baseSegments.length, 3)

          for (let depth = baseDepth; depth >= 1; depth--) {
            addClassName(baseSegments.slice(-depth).join('/'))
          }
        }
      }
    } else {
      addClassName(normalizedType.replace(/^@[^/]+\//, ''))
    }

    addClassName(normalizedType)

    for (const className of classNames) {
      if (isPluginConstructor(mod[className])) return mod[className]
    }

    if (isPluginConstructor(mod.default)) return mod.default

    throw Error(
      `[defineApi] Failed to resolve plugin class "${classNames[0]}" from "${moduleName}" for plugin "${pluginName}". Supported exports are named class "${classNames[0]}" or default class export.`,
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
      const PluginConstructor = await this.resolvePluginConstructor(
        moduleName,
        pluginType,
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
 *
 * @template TSchema - Zod schema used to validate `event.params`.
 * @template TEvent - Raw event type passed to the function.
 * @template TContext - Runtime context type.
 * @template THandler - Handler signature used to infer the response type.
 * @param {Omit<DefineApiOptions<TSchema, TEvent, TContext, Awaited<ReturnType<THandler>>>, 'handler'> & { handler: THandler }} options - Schema and handler used to build the API function.
 * @param {TSchema} [options.schema] - Optional Zod schema used to validate `event.params`.
 * @param {THandler} options.handler - Async business handler executed after plugins and validation are ready.
 * @throws {Error} When the required `http` plugin is missing from function config.
 * @throws {HttpError} When `event.params` fails schema validation.
 *
 * @example
 * ```ts
 * import { defineApi, z } from '@faasjs/core'
 *
 * const schema = z.object({
 *   name: z.string().min(1),
 * })
 *
 * export const func = defineApi({
 *   schema,
 *   async handler({ params }) {
 *     return {
 *       message: `Hello, ${params.name}`,
 *     }
 *   },
 * })
 * ```
 */
export function defineApi<
  TSchema extends ZodType | undefined = undefined,
  TEvent = any,
  TContext = any,
  THandler extends (data: DefineApiData<TSchema, TEvent, TContext, any>) => Promise<any> = (
    data: DefineApiData<TSchema, TEvent, TContext, any>,
  ) => Promise<any>,
>(
  options: Omit<
    DefineApiOptions<TSchema, TEvent, TContext, Awaited<ReturnType<THandler>>>,
    'handler'
  > & {
    handler: THandler
  },
): Func<DefineApiEvent<TSchema, TEvent>, TContext, Awaited<ReturnType<THandler>>> {
  type Event = DefineApiEvent<TSchema, TEvent>
  type Result = Awaited<ReturnType<THandler>>

  let func: CoreFunc<Event, TContext, Result>
  type Params = DefineApiData<TSchema, TEvent, TContext, Result>['params']

  let pluginRefsResolved = false
  let hasHttp = false

  const parseParams = async (event: Event): Promise<Params> => {
    if (!pluginRefsResolved) {
      hasHttp = !!findPluginByType(func, 'http')
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

  const invokeHandler: Handler<Event, TContext, Result> = async (data) => {
    const params = await parseParams(data.event)

    const invokeData = {
      ...data,
      params,
    } as DefineApiData<TSchema, TEvent, TContext, Result>

    return options.handler(invokeData)
  }

  func = new CoreFunc<Event, TContext, Result>({
    plugins: [],
    handler: invokeHandler,
  })

  return func
}
