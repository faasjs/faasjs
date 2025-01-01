import { type Level, Logger } from './logger'

export type LoggerMessage = {
  level: Level
  labels: string[]
  message: string
  timestamp: number
  extra?: any[]
}

export type TransportHandler = (messages: LoggerMessage[]) => Promise<void>

export type TransportOptions = {
  /** @default 'LoggerTransport' */
  label?: string
  /** @default 5000 */
  interval?: number
  /** @default false */
  debug?: boolean
}

class Transport {
  private enabled = true
  public handlers: Map<string, TransportHandler> = new Map()
  private logger: Logger
  public messages: LoggerMessage[] = []
  private flushing = false
  private interval: NodeJS.Timeout
  private intervalTime = 5000

  constructor() {
    this.logger = new Logger('LoggerTransport')
    this.logger.level = 'info'

    this.flush = this.flush.bind(this)

    this.interval = setInterval(this.flush, this.intervalTime)
  }

  register(name: string, handler: TransportHandler) {
    this.logger.info('register', name)

    this.handlers.set(name, handler)

    if (!this.enabled) this.enabled = true
  }

  unregister(name: string) {
    this.logger.info('unregister', name)

    this.handlers.delete(name)

    if (this.handlers.size === 0) this.enabled = false
  }

  insert(message: LoggerMessage) {
    if (!this.enabled) return

    this.messages.push(message)
  }

  async flush() {
    if (this.flushing)
      return new Promise<void>(resolve => {
        const interval = setInterval(() => {
          if (!this.flushing) {
            clearInterval(interval)
            resolve()
          }
        }, 100)
      })

    if (!this.enabled || this.messages.length === 0) return

    if (this.handlers.size === 0) {
      this.logger.warn('no handlers to flush, disable transport')
      this.messages.splice(0, this.messages.length)
      this.enabled = false
      clearInterval(this.interval)
      return
    }

    this.flushing = true

    const messages = this.messages.splice(0, this.messages.length)

    this.logger.debug(
      'flushing %d messages with %d handlers',
      messages.length,
      this.handlers.size
    )

    for (const handler of this.handlers.values())
      try {
        await handler(messages)
      } catch (error) {
        this.logger.error(handler.name, error)
      }

    this.flushing = false
  }

  async stop() {
    this.logger.info('stopping')

    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }

    await this.flush()

    this.enabled = false
  }

  reset() {
    this.handlers.clear()
    this.messages.splice(0, this.messages.length)
    this.enabled = true

    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }
  }

  config(options: TransportOptions) {
    if (options.label) this.logger.label = options.label

    if (typeof options.debug === 'boolean')
      this.logger.level = options.debug ? 'debug' : 'info'

    if (options.interval && options.interval !== this.intervalTime) {
      this.intervalTime = options.interval
      clearInterval(this.interval)
      this.interval = setInterval(this.flush, this.intervalTime)
    }

    if (!this.enabled) this.enabled = true
  }
}

let current: Transport

export function getTransport() {
  current ||= new Transport()

  return current
}

/**
 * Registers a transport handler with a given name.
 *
 * @param name - The name of the transport handler.
 * @param handler - The transport handler to be registered.
 *
 * @example
 * ```typescript
 * import { registerTransportHandler } from '@faasjs/logger'
 *
 * registerTransportHandler('test', async (messages) => {
 *  for (const { level, message } of messages)
 *   console.log(level, message)
 * })
 * ```
 */
export function registerTransportHandler(
  name: string,
  handler: TransportHandler
) {
  getTransport().register(name, handler)
}

/**
 * Unregister a transport by its name.
 *
 * @param name - The name of the transport to unregister.
 *
 * @example
 * ```typescript
 * import { unregisterTransportHandler } from '@faasjs/logger'
 *
 * unregisterTransportHandler('test')
 * ```
 */
export function unregisterTransportHandler(name: string) {
  getTransport().unregister(name)
}

export const CachedMessages: LoggerMessage[] = []

/**
 * Inserts a log message into the transport.
 *
 * @param message - The log message to insert.
 *
 * @example
 *
 * ```typescript
 * import { insertMessageToTransport } from '@faasjs/logger'
 *
 * insertMessageToTransport({
 *   level: 'info',
 *   labels: ['server'],
 *   message: 'test message',
 *   timestamp: Date.now()
 * })
 * ```
 */
export function insertMessageToTransport(message: LoggerMessage) {
  getTransport().insert(message)
}

/**
 * Flushes the cached log messages by sending them to all registered transports.
 *
 * If a flush operation is already in progress, this function will wait until
 * the current flush is complete before starting a new one.
 *
 * @returns A promise that resolves when the flush operation is complete.
 *
 * @example
 *
 * ```typescript
 * import { flushTransportMessages } from '@faasjs/logger'
 *
 * process.on('SIGINT', async () => {
 *   await flushTransportMessages()
 *   process.exit(0)
 * })
 * ```
 */
export async function flushTransportMessages() {
  return getTransport().flush()
}

/**
 * Starts the logging transport with the specified options.
 *
 * This function sets a timeout to periodically flush cached messages.
 * If there are any cached messages, it will flush them and then restart the process.
 *
 * @param {TransportOptions} [options={}] - The options to configure the logging transport.
 * @param {number} [options.interval=5000] - The interval in milliseconds at which to flush cached messages.
 *
 * @example
 * ```typescript
 * import { startTransport } from '@faasjs/logger'
 *
 * start()
 * ```
 */
export function startTransport(options: TransportOptions = {}) {
  getTransport().config(options)
}

/**
 * Stops the logging transport.
 *
 * If there are any cached messages, it flushes them.
 *
 * @returns {Promise<void>} A promise that resolves when the logging transport is stopped.
 */
export async function stopTransport() {
  await getTransport().stop()
}

/**
 * Resets the logging system to its default state.
 *
 * This function performs the following actions:
 * - Enables logging by setting the `enabled` flag to `true`.
 * - Clears all transports by calling `Transports.clear()`.
 * - Empties the cached messages by splicing the `CachedMessages` array.
 */
export function resetTransport() {
  getTransport().reset()
}
