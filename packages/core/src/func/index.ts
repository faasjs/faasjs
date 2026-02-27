import { randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { Logger } from '@faasjs/node-utils'
import { RunHandler } from '../plugins/run_handler'

export type Handler<TEvent = any, TContext = any, TResult = any> = (
  data: InvokeData<TEvent, TContext>,
) => Promise<TResult>

export type Next = () => Promise<void>

export type ExportedHandler<TEvent = any, TContext = any, TResult = any> = (
  event?: TEvent,
  context?: TContext,
  callback?: (...args: any) => any,
) => Promise<TResult>

export type Plugin = {
  [key: string]: any
  readonly type: string
  readonly name: string
  onMount?: (data: MountData, next: Next) => Promise<void>
  onInvoke?: (data: InvokeData, next: Next) => Promise<void>
}

export type Config = {
  [key: string]: any
  plugins?: {
    [key: string]: {
      [key: string]: any
      type?: string
      config?: {
        [key: string]: any
      }
    }
  }
}

export type MountData = {
  [key: string]: any
  config: Config
  event: any
  context: any
}

type MutableMountData = {
  [key: string]: any
  config?: Config
  event?: any
  context?: any
  logger?: Logger
}

export type InvokeData<TEvent = any, TContext = any, TResult = any> = {
  [key: string]: any
  event: TEvent
  context: TContext
  callback: any
  response: any
  logger: Logger
  handler?: Handler<TEvent, TContext, TResult>
  config: Config
}

export type LifeCycleKey = 'onMount' | 'onInvoke'

export type FuncConfig<TEvent = any, TContext = any, TResult = any> = {
  plugins?: Plugin[]
  handler?: Handler<TEvent, TContext, TResult>
}

type CachedFunction = {
  key: string
  handler: (...args: any) => void
}

/**
 * Get the event type of a func.
 *
 * @example
 * ```ts
 * import { defineApi } from '@faasjs/core'
 * import type { FuncEventType } from '@faasjs/core'
 *
 * const func = defineApi<undefined, { counter: number }>({
 *   async handler() {
 *     return null
 *   },
 * })
 *
 * FuncEventType<typeof func> // => { counter: number }
 * ```
 */
export type FuncEventType<T extends Func<any, any, any>> =
  T extends Func<infer P, any, any> ? P : any

/**
 * Get the return type of a func.
 *
 * @example
 * ```ts
 * import { defineApi } from '@faasjs/core'
 * import type { FuncReturnType } from '@faasjs/core'
 *
 * const func = defineApi<undefined, any, any, number>({
 *   async handler() {
 *     return 1
 *   },
 * })
 *
 * FuncReturnType<typeof func> // => number
 * ```
 */
export type FuncReturnType<T extends Func<any, any, any>> =
  T extends Func<any, any, infer R> ? R : any

export type NormalizePluginType<TType extends string> = TType extends `npm:${infer Name}`
  ? Name
  : TType extends `@faasjs/${infer Name}`
    ? Name
    : TType

export type UnionToIntersection<T> = (T extends unknown ? (arg: T) => void : never) extends (
  arg: infer TResult,
) => void
  ? TResult
  : never

export type Simplify<T> = {
  [K in keyof T]: T[K]
} & {}

/**
 * Plugin event augmentation map.
 *
 * Extend this interface in plugin packages to describe which event fields are
 * injected when the plugin is enabled through `faas.yaml`.
 */
// biome-ignore lint/suspicious/noEmptyInterface: declaration merging entrypoint for plugin packages
export interface FaasPluginEventMap {}

export type ResolvePluginEvent<TType extends string> =
  NormalizePluginType<TType> extends keyof FaasPluginEventMap
    ? FaasPluginEventMap[NormalizePluginType<TType>]
    : Record<never, never>

/**
 * Infer event type from plugin type names.
 *
 * @example
 * ```ts
 * type Event = InferPluginEvent<['http']>
 * ```
 */
export type InferPluginEvent<TPlugins extends readonly string[]> = Simplify<
  Record<string, any> & UnionToIntersection<ResolvePluginEvent<TPlugins[number]>>
>

export function parseFuncFilenameFromStack(stack?: string): string | undefined {
  if (!stack) return

  const frame = stack
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.includes('.func.ts'))

  if (!frame) return

  const content = frame.replace(/^at\s+/, '')
  const location =
    content.endsWith(')') && content.includes('(')
      ? content.slice(content.lastIndexOf('(') + 1, -1)
      : content
  const match = location.match(/^(.+\.func\.ts):\d+:\d+$/)

  if (!match) return

  const filename = match[1]

  if (filename.startsWith('file://')) {
    try {
      return fileURLToPath(filename)
    } catch (_) {
      return filename
    }
  }

  return filename
}

function normalizeMountData(
  data: MutableMountData | undefined,
  options: {
    loggerLabel: string
    defaultConfig?: Config
    ensureEventAndContext?: boolean
  },
): MountData {
  const mountData = (data || Object.create(null)) as MutableMountData
  const ensureEventAndContext = options.ensureEventAndContext ?? true

  if (!mountData.config) mountData.config = options.defaultConfig || Object.create(null)

  if (ensureEventAndContext) {
    if (!mountData.context) mountData.context = Object.create(null)
    if (!mountData.event) mountData.event = Object.create(null)
  }

  if (!mountData.logger) mountData.logger = new Logger(options.loggerLabel)

  return mountData as MountData
}

export class Func<TEvent = any, TContext = any, TResult = any> {
  [key: string]: any
  public plugins: Plugin[]
  public handler?: Handler<TEvent, TContext, TResult>
  public config: Config
  public mounted = false
  public filename?: string
  private cachedFunctions: {
    [cycleKey in LifeCycleKey]: CachedFunction[]
  } = Object.create(null)

  /**
   * Create a cloud function.
   */
  constructor(config: FuncConfig<TEvent, TContext>) {
    if (config.handler) this.handler = config.handler
    this.plugins = config.plugins || []
    this.plugins.push(new RunHandler())
    this.config = {
      plugins: Object.create(null),
    }

    try {
      const filename = parseFuncFilenameFromStack(new Error().stack)

      if (filename) this.filename = filename
    } catch (_) {}
  }

  private getCachedFunctions(key: LifeCycleKey): CachedFunction[] {
    const cached = this.cachedFunctions[key]
    if (cached) return cached

    const list: CachedFunction[] = []

    for (const plugin of this.plugins) {
      const handler = plugin[key]

      if (typeof handler !== 'function') continue

      list.push({
        key: plugin.name,
        handler: handler.bind(plugin),
      })
    }

    this.cachedFunctions[key] = list

    return list
  }

  private compose(key: LifeCycleKey): (data: any, next?: () => void) => any {
    const list = this.getCachedFunctions(key)

    return async (data: any, next?: () => void): Promise<any> => {
      let index = -1

      if (!data.logger) data.logger = new Logger()

      const dispatch = async (i: number): Promise<any> => {
        if (i <= index) return Promise.reject(Error('next() called multiple times'))

        index = i
        let fn: any = list[i]

        if (i === list.length) fn = next

        if (!fn) return Promise.resolve()

        if (typeof fn.key === 'undefined') fn.key = `uname#${i}`

        if (!data.context) data.context = Object.create(null)

        if (!data.context.request_at) data.context.request_at = randomBytes(16).toString('hex')

        const label = `${data.context.request_id}] [${fn.key}] [${key}`
        data.logger.label = label
        data.logger.debug('begin')
        data.logger.time(label)

        try {
          const res = await Promise.resolve(fn.handler(data, dispatch.bind(null, i + 1)))
          data.logger.label = label
          data.logger.timeEnd(label, 'end')
          return res
        } catch (err) {
          data.logger.label = label
          data.logger.timeEnd(label, 'failed')
          data.logger.error(err)
          return Promise.reject(err)
        }
      }

      return await dispatch(0)
    }
  }

  /**
   * First time mount the function.
   */
  public async mount(
    data: {
      event: TEvent
      context: TContext
      config?: Config
      logger?: Logger
    } = {
      event: Object.create(null),
      context: Object.create(null),
    },
  ): Promise<void> {
    const mountData = normalizeMountData(data as MutableMountData, {
      loggerLabel: 'Func',
      defaultConfig: this.config,
      ensureEventAndContext: false,
    })

    if (this.mounted) {
      mountData.logger.warn('mount() has been called, skipped.')
      return
    }

    mountData.logger.debug(`plugins: ${this.plugins.map((p) => `${p.type}#${p.name}`).join(',')}`)
    await this.compose('onMount')(mountData)
    this.mounted = true
  }

  /**
   * Invoke the function.
   */
  public async invoke(data: InvokeData<TEvent, TContext, TResult>): Promise<void> {
    if (!this.mounted) await this.mount(data)

    try {
      await this.compose('onInvoke')(data)
    } catch (error: any) {
      data.logger.error(error)
      data.response = error
    }
  }

  /**
   * Export the function.
   */
  public export(): {
    handler: ExportedHandler<TEvent, TContext, TResult>
  } {
    const handler = async (
      event?: TEvent,
      context?: TContext | any,
      callback?: (...args: any) => any,
    ): Promise<TResult> => {
      if (typeof context === 'undefined') context = {}

      if (!context.request_id)
        context.request_id =
          (event as any)?.headers?.['x-faasjs-request-id'] || randomBytes(16).toString('hex')

      if (!context.request_at) context.request_at = randomBytes(16).toString('hex')

      context.callbackWaitsForEmptyEventLoop = false

      const logger = new Logger(context.request_id)

      const data: InvokeData<TEvent, TContext, TResult> = {
        event: event ?? Object.create(null),
        context,
        callback,
        response: undefined,
        logger,
        config: this.config,
        ...(this.handler ? { handler: this.handler } : {}),
      }

      await this.invoke(data)

      if (Object.prototype.toString.call(data.response) === '[object Error]') throw data.response

      return data.response
    }

    return {
      handler: handler.bind(this),
    }
  }
}

let plugins: Plugin[] = []

export type UseifyPlugin<T> = T & {
  mount: (data?: MountData) => Promise<T>
}

export function usePlugin<T extends Plugin>(
  plugin: T & {
    mount?: (data?: MountData) => Promise<T>
  },
) {
  if (!plugins.find((p) => p.name === plugin.name)) plugins.push(plugin)

  if (!plugin.mount)
    plugin.mount = async (data?: MountData) => {
      const mountData = normalizeMountData(data as MutableMountData, {
        loggerLabel: plugin.name,
      })

      if (plugin.onMount) await plugin.onMount(mountData, async () => Promise.resolve())

      return plugin
    }

  return plugin as UseifyPlugin<T>
}

/**
 * Create a cloud function.
 */
export function useFunc<TEvent = any, TContext = any, TResult = any>(
  handler: () => Handler<TEvent, TContext, TResult>,
) {
  plugins = []

  const invokeHandler = handler()

  const func = new Func<TEvent, TContext, TResult>({
    plugins,
    handler: invokeHandler,
  })

  plugins = []

  return func
}
