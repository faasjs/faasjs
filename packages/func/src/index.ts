/**
 * FaasJS's function module.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/func.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/func/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/func.svg)](https://www.npmjs.com/package/@faasjs/func)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/func
 * ```
 * @packageDocumentation
 */
import { Logger } from '@faasjs/logger'
import { RunHandler } from './plugins/run_handler'
import { randomBytes } from 'node:crypto'

export type Handler<TEvent = any, TContext = any, TResult = any> = (
  data: InvokeData<TEvent, TContext>
) => Promise<TResult>
export type Next = () => Promise<void>
export type ExportedHandler<TEvent = any, TContext = any, TResult = any> = (
  event?: TEvent,
  context?: TContext,
  callback?: (...args: any) => any
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
      type: string
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
 * Get the event type of a func
 *
 * @example
 * ```ts
 * import { useFunc, type FuncEventType } from '@faasjs/func'
 *
 * const func = useFunc<{ counter: number }>(() => async () => {})
 *
 * FuncEventType<typeof func> // => { counter: number }
 * ```
 */
export type FuncEventType<T extends Func<any, any, any>> = T extends Func<
  infer P,
  any,
  any
>
  ? P
  : any

/**
 * Get the return type of a func
 *
 * @example
 * ```ts
 * import { useFunc, type FuncReturnType } from '@faasjs/func'
 *
 * const func = useFunc(() => async () => 1)
 *
 * FuncReturnType<typeof func> // => number
 * ```
 */
export type FuncReturnType<T extends Func<any, any, any>> = T extends Func<
  any,
  any,
  infer R
>
  ? R
  : any

export class Func<TEvent = any, TContext = any, TResult = any> {
  [key: string]: any
  public plugins: Plugin[]
  public handler?: Handler<TEvent, TContext, TResult>
  public config: Config
  public mounted: boolean
  public filename?: string
  private cachedFunctions: {
    [cycleKey in LifeCycleKey]: CachedFunction[]
  }

  /**
   * Create a cloud function
   * @param config {object} config
   * @param config.plugins {Plugin[]} plugins list
   * @param config.handler {Handler} business logic
   */
  constructor(config: FuncConfig<TEvent, TContext>) {
    this.handler = config.handler
    this.plugins = config.plugins || []
    this.plugins.push(new RunHandler())
    this.config = {
      plugins: Object.create(null),
    }

    this.mounted = false
    this.cachedFunctions = Object.create(null)

    try {
      this.filename = new Error().stack
        .split('\n')
        .find(s => /[^/]\.func\.ts/.test(s))
        .match(/\((.*\.func\.ts).*\)/)[1]
    } catch (_) {}
  }

  private compose(key: LifeCycleKey): (data: any, next?: () => void) => any {
    let list: CachedFunction[] = []

    if (this.cachedFunctions[key]) list = this.cachedFunctions[key]
    else {
      for (const plugin of this.plugins) {
        const handler = plugin[key]
        if (typeof handler === 'function')
          list.push({
            key: plugin.name,
            handler: handler.bind(plugin),
          })
      }

      this.cachedFunctions[key] = list
    }

    return async (data: any, next?: () => void): Promise<any> => {
      let index = -1
      const logger = data?.logger || new Logger()

      const dispatch = async (i: number): Promise<any> => {
        if (i <= index)
          return Promise.reject(Error('next() called multiple times'))
        index = i
        let fn: any = list[i]
        if (i === list.length) fn = next
        if (!fn) return Promise.resolve()
        if (typeof fn.key === 'undefined') fn.key = `UnNamedPlugin#${i}`
        logger.debug('[%s] [%s] begin', fn.key, key)
        logger.time(fn.key)
        try {
          const res = await Promise.resolve(
            fn.handler(data, dispatch.bind(null, i + 1))
          )
          logger.timeEnd(fn.key, '[%s] [%s] end', fn.key, key)
          return res
        } catch (err) {
          logger.timeEnd(fn.key, '[%s] [%s] failed', fn.key, key)
          logger.error(err)
          return Promise.reject(err)
        }
      }

      return await dispatch(0)
    }
  }

  /**
   * First time mount the function
   */
  public async mount(data: {
    event: TEvent
    context: TContext
    config?: Config
    logger?: Logger
  }): Promise<void> {
    if (!data.logger) data.logger = new Logger('Func')

    const logger = new Logger(data.logger?.label || 'Func')

    if (!logger.label.endsWith('Func')) logger.label = `${logger.label}] [Func`

    logger.debug('onMount')
    if (this.mounted) {
      logger.warn('mount() has been called, skipped.')
      return
    }

    if (!data.config) data.config = this.config

    try {
      logger.time('mount')
      logger.debug(
        `Plugins: ${this.plugins.map(p => `${p.type}#${p.name}`).join(',')}`
      )
      await this.compose('onMount')(data)
      this.mounted = true
    } finally {
      logger.timeEnd('mount', 'mounted')
    }
  }

  /**
   * Invoke the function
   * @param data {object} data
   */
  public async invoke(
    data: InvokeData<TEvent, TContext, TResult>
  ): Promise<void> {
    if (!this.mounted)
      await this.mount({
        event: data.event,
        context: data.context,
        config: data.config,
        logger: data.logger,
      })

    try {
      await this.compose('onInvoke')(data)
    } catch (error: any) {
      data.logger.error(error)
      data.response = error
    }
  }

  /**
   * Export the function
   */
  public export(): {
    handler: ExportedHandler<TEvent, TContext, TResult>
  } {
    const handler = async (
      event?: TEvent,
      context?: TContext | any,
      callback?: (...args: any) => any
    ): Promise<TResult> => {
      if (typeof context === 'undefined') context = {}
      if (!context.request_id)
        context.request_id =
          (event as any)?.headers?.['x-faasjs-request-id'] ||
          randomBytes(16).toString('hex')
      if (!context.request_at)
        context.request_at = Math.round(Date.now() / 1000)
      context.callbackWaitsForEmptyEventLoop = false

      const logger = new Logger(context.request_id)
      logger.debug('event: %j', event)
      logger.debug('context: %j', context)

      const data: InvokeData<TEvent, TContext, TResult> = {
        event,
        context,
        callback,
        response: undefined,
        handler: this.handler,
        logger,
        config: this.config,
      }

      await this.invoke(data)

      if (Object.prototype.toString.call(data.response) === '[object Error]')
        throw data.response

      return data.response
    }

    handler.bind(this)

    return { handler }
  }
}

let plugins: Plugin[] = []

export type UseifyPlugin<T> = T & {
  mount: (data?: { config?: Config }) => Promise<T>
}

export function usePlugin<T extends Plugin>(
  plugin: T & {
    mount?: (data?: { config?: Config }) => Promise<T>
  }
) {
  if (!plugins.find(p => p.name === plugin.name)) plugins.push(plugin)

  if (!plugin.mount)
    plugin.mount = async (data?: { config?: Config }) => {
      if (plugin.onMount)
        await plugin.onMount(
          {
            config: data?.config || Object.create(null),
            event: Object.create(null),
            context: Object.create(null),
            logger: new Logger(plugin.name),
          },
          async () => Promise.resolve()
        )

      return plugin
    }

  return plugin as UseifyPlugin<T>
}

/**
 * ```ts
 * // pure function
 * export default useFunc(() => {
 *   return () => {
 *     return 'Hello World'
 *   }
 * })
 *
 * // with http
 * import { useHttp } from '@faasjs/http'
 *
 * export default useFunc(() => {
 *   const http = useHttp<{ name: string }>()
 *
 *   return () => {
 *     return `Hello ${http.params.name}`
 *   }
 * })
 * ```
 */
export function useFunc<TEvent = any, TContext = any, TResult = any>(
  handler: () => Handler<TEvent, TContext, TResult>
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
