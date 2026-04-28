import { randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'

import { Logger } from '@faasjs/node-utils'

import { RunHandler } from '../plugins/run_handler'

/**
 * User-defined handler executed after plugins have prepared invoke data.
 *
 * @template TEvent - Runtime event type.
 * @template TContext - Runtime context type.
 * @template TResult - Async result type returned by the handler.
 *
 * @param {InvokeData<TEvent, TContext, TResult>} data - Invocation data exposed to the handler.
 * @param {TEvent} data.event - Runtime event payload received from the caller.
 * @param {TContext} data.context - Runtime context payload forwarded by the platform.
 * @param {Logger} data.logger - Request-scoped logger instance.
 * @param {any} data.response - Mutable response slot shared across plugins and the handler.
 * @param {Config} data.config - Resolved function configuration loaded during mount.
 * @returns {Promise<TResult>} Handler result that becomes the function response.
 */
export type Handler<TEvent = any, TContext = any, TResult = any> = (
  data: InvokeData<TEvent, TContext>,
) => Promise<TResult>

/**
 * Continue to the next lifecycle hook in the current plugin chain.
 */
export type Next = () => Promise<void>

/**
 * Handler returned by {@link Func.export}.
 *
 * @template TEvent - Runtime event type.
 * @template TContext - Runtime context type.
 * @template TResult - Async result type returned by the handler.
 *
 * @param {TEvent} [event] - Runtime event payload.
 * @param {TContext} [context] - Runtime context object.
 * @returns {Promise<TResult>} Final function response.
 */
export type ExportedHandler<TEvent = any, TContext = any, TResult = any> = (
  event?: TEvent,
  context?: TContext,
) => Promise<TResult>

/**
 * Lifecycle plugin attached to a {@link Func}.
 *
 * @property {string} type - Stable plugin type identifier.
 * @property {string} name - Instance name used for ordering and logs.
 * @property {(config: { type: string; name: string; config?: Record<string, any> }) => void | Promise<void>} [applyConfig] - Optional hook that receives the resolved config for an already-registered plugin instance.
 * @property {(data: MountData, next: Next) => Promise<void>} [onMount] - Optional hook that runs once before the first invoke.
 * @property {(data: InvokeData, next: Next) => Promise<void>} [onInvoke] - Optional hook that runs for every invocation.
 */
export type Plugin = {
  [key: string]: any
  readonly type: string
  readonly name: string
  applyConfig?: (config: {
    [key: string]: any
    readonly type: string
    readonly name: string
    config?: {
      [key: string]: any
    }
  }) => void | Promise<void>
  onMount?: (data: MountData, next: Next) => Promise<void>
  onInvoke?: (data: InvokeData, next: Next) => Promise<void>
}

/**
 * Resolved config object loaded for a function.
 *
 * @property {Record<string, { type?: string; config?: Record<string, any> }>} [plugins] - Plugin configuration keyed by plugin name.
 */
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

/**
 * Data passed to plugin mount hooks.
 *
 * @property {Config} config - Function configuration available during mount.
 * @property {any} event - Initial event value used when mounting.
 * @property {any} context - Initial context value used when mounting.
 */
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

/**
 * Mutable invocation state shared by plugins and the final handler.
 *
 * @template TEvent - Runtime event type.
 * @template TContext - Runtime context type.
 * @template TResult - Async result type produced by the handler.
 *
 * @property {TEvent} event - Runtime event payload.
 * @property {TContext} context - Runtime context payload.
 * @property {any} response - Response value produced by plugins or handlers.
 * @property {Logger} logger - Request-scoped logger instance.
 * @property {Handler<TEvent, TContext, TResult>} [handler] - Final business handler when one exists.
 * @property {Config} config - Resolved function configuration.
 */
export type InvokeData<TEvent = any, TContext = any, TResult = any> = {
  [key: string]: any
  event: TEvent
  context: TContext
  response: any
  logger: Logger
  handler?: Handler<TEvent, TContext, TResult>
  config: Config
}

/**
 * Supported plugin lifecycle keys used by {@link Func}.
 */
export type LifeCycleKey = 'onMount' | 'onInvoke'

/**
 * Constructor options for {@link Func}.
 *
 * @template TEvent - Runtime event type.
 * @template TContext - Runtime context type.
 * @template TResult - Async result type produced by the handler.
 *
 * @property {Plugin[]} [plugins] - Ordered plugin list to attach before the run handler.
 * @property {Handler<TEvent, TContext, TResult>} [handler] - Final business handler invoked after plugins complete.
 */
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
 * @template T - Func instance whose event type should be extracted.
 */
export type FuncEventType<T extends Func<any, any, any>> =
  T extends Func<infer P, any, any> ? P : any

/**
 * Get the return type of a func.
 *
 * @template T - Func instance whose return type should be extracted.
 */
export type FuncReturnType<T extends Func<any, any, any>> =
  T extends Func<any, any, infer R> ? R : any

/**
 * Extract a `.api.ts` file path from a captured stack trace.
 *
 * @param {string} [stack] - Stack trace text to inspect.
 * @returns {string | undefined} Absolute or file URL converted source path when found.
 *
 * @example
 * ```ts
 * import { parseApiFilenameFromStack } from '@faasjs/core'
 *
 * const filename = parseApiFilenameFromStack(
 *   'Error\\n    at file:///project/src/demo.api.ts:3:1',
 * )
 * ```
 */
export function parseApiFilenameFromStack(stack?: string): string | undefined {
  if (!stack) return

  const frame = stack
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.includes('.api.ts'))

  if (!frame) return

  const content = frame.replace(/^at\s+/, '')
  const location =
    content.endsWith(')') && content.includes('(')
      ? content.slice(content.lastIndexOf('(') + 1, -1)
      : content
  const match = location.match(/^(.+\.api\.ts):\d+:\d+$/)

  if (!match) return

  const filename = match[1]

  if (filename.startsWith('file://')) {
    try {
      return fileURLToPath(filename)
    } catch {
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

/**
 * Core executable unit used by FaasJS runtimes and helpers.
 *
 * A {@link Func} composes lifecycle plugins, exposes a runtime handler via
 * {@link Func.export}, and keeps function configuration available across mounts
 * and invokes.
 *
 * @template TEvent - Runtime event type.
 * @template TContext - Runtime context type.
 * @template TResult - Async result type produced by the handler.
 *
 * @example
 * ```ts
 * import { Func } from '@faasjs/core'
 *
 * const func = new Func({
 *   async handler({ event }) {
 *     return { echo: event }
 *   },
 * })
 *
 * const result = await func.export().handler({ name: 'FaasJS' })
 * ```
 */
export class Func<TEvent = any, TContext = any, TResult = any> {
  [key: string]: any
  /**
   * Ordered plugin instances attached to this function.
   */
  public plugins: Plugin[]
  /**
   * Final business handler invoked after plugins finish.
   */
  public handler?: Handler<TEvent, TContext, TResult>
  /**
   * Mutable runtime configuration used by the function.
   */
  public config: Config
  /**
   * Indicates whether mount hooks have already run.
   */
  public mounted = false
  /**
   * Resolved source filename inferred from the constructor call stack.
   */
  public filename?: string
  private cachedFunctions: {
    [cycleKey in LifeCycleKey]: CachedFunction[]
  } = Object.create(null)

  /**
   * Create a FaasJS function.
   *
   * @param {FuncConfig<TEvent, TContext, TResult>} config - Plugins and optional business handler used to configure the function.
   * @param {Plugin[]} [config.plugins] - Ordered plugin list attached before the built-in run handler.
   * @param {Handler<TEvent, TContext, TResult>} [config.handler] - Final business handler invoked after plugins complete.
   */
  constructor(config: FuncConfig<TEvent, TContext>) {
    if (config.handler) this.handler = config.handler
    this.plugins = config.plugins || []
    this.plugins.push(new RunHandler())
    this.config = {
      plugins: Object.create(null),
    }

    try {
      const filename = parseApiFilenameFromStack(new Error().stack)

      if (filename) this.filename = filename
    } catch {}
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
   *
   * @param {object} [data] - Optional initial event, context, config, and logger used during mount.
   * @param {TEvent} data.event - Initial event value passed through mount hooks.
   * @param {TContext} data.context - Initial context value passed through mount hooks.
   * @param {Config} [data.config] - Function config override used during mount.
   * @param {Logger} [data.logger] - Logger override used during mount.
   * @returns {Promise<void>} Promise that resolves after mount hooks complete.
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
   *
   * @param {InvokeData<TEvent, TContext, TResult>} data - Invocation state mutated by plugins and the final handler.
   * @param {TEvent} data.event - Runtime event payload.
   * @param {TContext} data.context - Runtime context payload.
   * @param {Logger} data.logger - Request-scoped logger instance.
   * @param {any} data.response - Mutable response value shared across plugins and handlers.
   * @param {Config} data.config - Resolved function configuration.
   * @returns {Promise<void>} Promise that resolves after invoke hooks complete.
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
   * Build the exported handler wrapper for the function.
   *
   * @returns {{ handler: ExportedHandler<TEvent, TContext, TResult> }} Object containing the exported handler.
   */
  public export(): {
    handler: ExportedHandler<TEvent, TContext, TResult>
  } {
    const func = this

    const handler: ExportedHandler<TEvent, TContext, TResult> = async function (
      event?: TEvent,
      context?: TContext,
    ): Promise<TResult> {
      const runtimeContext = ((typeof context === 'undefined' ? Object.create(null) : context) ||
        Object.create(null)) as TContext & {
        request_id?: string
        request_at?: string
        [key: string]: any
      }

      if (!runtimeContext.request_id)
        runtimeContext.request_id =
          (event as any)?.headers?.['x-faasjs-request-id'] || randomBytes(16).toString('hex')

      if (!runtimeContext.request_at) runtimeContext.request_at = randomBytes(16).toString('hex')

      const logger = new Logger(runtimeContext.request_id)

      const data: InvokeData<TEvent, TContext, TResult> = {
        event: event ?? Object.create(null),
        context: runtimeContext as TContext,
        response: undefined,
        logger,
        config: func.config,
        ...(func.handler ? { handler: func.handler } : {}),
      }

      await func.invoke(data)

      if (Object.prototype.toString.call(data.response) === '[object Error]') throw data.response

      return data.response
    }

    return {
      handler,
    }
  }
}
