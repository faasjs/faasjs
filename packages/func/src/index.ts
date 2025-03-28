/**
 * FaasJS's function module.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/func.svg)](https://github.com/faasjs/faasjs/blob/main/packages/func/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/func.svg)](https://www.npmjs.com/package/@faasjs/func)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/func
 * ```
 *
 * ## Usage
 *
 * @see {@link useFunc}
 *
 * @packageDocumentation
 */

import { randomBytes } from 'node:crypto'
import { Logger } from '@faasjs/logger'
import { RunHandler } from './plugins/run_handler'

export * from './utils'

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
  public mounted = false
  public filename?: string
  private cachedFunctions: {
    [cycleKey in LifeCycleKey]: CachedFunction[]
  } = Object.create(null)

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

    try {
      const stack = new Error().stack
      if (stack) {
        const match = stack
          .split('\n')
          .find(s => /[^/]\.func\.ts/.test(s))
          ?.match(/\((.*\.func\.ts).*\)/)
        if (match) {
          this.filename = match[1]
        }
      }
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
      if (!data.logger) data.logger = new Logger()

      const dispatch = async (i: number): Promise<any> => {
        if (i <= index)
          return Promise.reject(Error('next() called multiple times'))

        index = i
        let fn: any = list[i]

        if (i === list.length) fn = next

        if (!fn) return Promise.resolve()

        if (typeof fn.key === 'undefined') fn.key = `uname#${i}`

        if (!data.context) data.context = Object.create(null)

        if (!data.context.request_at)
          data.context.request_at = randomBytes(16).toString('hex')

        const label = `${data.context.request_id}] [${fn.key}] [${key}`
        data.logger.label = label
        data.logger.debug('begin')
        data.logger.time(label)
        try {
          const res = await Promise.resolve(
            fn.handler(data, dispatch.bind(null, i + 1))
          )
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
   * First time mount the function
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
    }
  ): Promise<void> {
    if (!data.logger) data.logger = new Logger('Func')

    if (this.mounted) {
      data.logger.warn('mount() has been called, skipped.')
      return
    }

    if (!data.config) data.config = this.config

    data.logger.debug(
      `plugins: ${this.plugins.map(p => `${p.type}#${p.name}`).join(',')}`
    )
    await this.compose('onMount')(data)
    this.mounted = true
  }

  /**
   * Invoke the function
   * @param data {object} data
   */
  public async invoke(
    data: InvokeData<TEvent, TContext, TResult>
  ): Promise<void> {
    if (!this.mounted) await this.mount(data)

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
        context.request_at = randomBytes(16).toString('hex')
      context.callbackWaitsForEmptyEventLoop = false

      const logger = new Logger(context.request_id)

      const data: InvokeData<TEvent, TContext, TResult> = {
        event: event ?? Object.create(null),
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
  }
) {
  if (!plugins.find(p => p.name === plugin.name)) plugins.push(plugin)

  if (!plugin.mount)
    plugin.mount = async (data?: MountData) => {
      const parsedData = data || Object.create(null)
      if (!parsedData.config) parsedData.config = Object.create(null)
      if (!parsedData.context) parsedData.context = Object.create(null)
      if (!parsedData.event) parsedData.event = Object.create(null)
      if (!parsedData.logger) parsedData.logger = new Logger(plugin.name)

      if (plugin.onMount)
        await plugin.onMount(parsedData, async () => Promise.resolve())

      return plugin
    }

  return plugin as UseifyPlugin<T>
}

/**
 * Create a cloud function.
 *
 * @example
 * ```ts
 * // pure function
 * export const func = useFunc(() => {
 *   return () => {
 *     return 'Hello World'
 *   }
 * })
 *
 * // with http
 * import { useHttp } from '@faasjs/http'
 *
 * export const func = useFunc<{
 *   params: { name: string }
 * }>(() => {
 *   useHttp()
 *
 *   return ({ event }) => {
 *     return `Hello ${event.params.name}`
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
