import { type Level, Logger } from '../logger'

/**
 * Serialized log entry sent to transport handlers.
 */
export type LoggerMessage = {
  /**
   * Log level that produced the message.
   */
  level: Level
  /**
   * Label segments captured from the logger.
   */
  labels: string[]
  /**
   * Fully formatted log text.
   */
  message: string
  /**
   * Unix timestamp in milliseconds for when the entry was created.
   */
  timestamp: number
  /**
   * Original extra values forwarded alongside the formatted message.
   */
  extra?: any[]
}

/**
 * Async callback used by {@link Transport} to flush buffered log messages.
 *
 * @param {LoggerMessage[]} messages - Buffered messages being flushed together.
 * @returns {Promise<void>} Promise that resolves when the batch has been processed.
 */
export type TransportHandler = (messages: LoggerMessage[]) => Promise<void>

/**
 * Options for configuring the shared logger transport.
 */
export type TransportOptions = {
  /**
   * Label used by the transport's internal {@link Logger}.
   *
   * @default 'LoggerTransport'
   */
  label?: string
  /**
   * Flush interval in milliseconds.
   *
   * @default 5000
   */
  interval?: number
  /**
   * When true, the transport's internal logger emits debug diagnostics.
   *
   * @default false
   */
  debug?: boolean
}

/**
 * Buffer log messages and flush them to registered async handlers on an interval.
 *
 * Use {@link getTransport} to access the shared singleton that {@link Logger} writes into by default.
 *
 * @see {@link getTransport}
 * @example
 * ```ts
 * import { getTransport } from '@faasjs/node-utils'
 *
 * const transport = getTransport()
 *
 * transport.register('test', async (messages) => {
 *   for (const { level, message } of messages)
 *     console.log(level, message)
 * })
 *
 * transport.config({ label: 'test', debug: true })
 *
 * // If you use Logger, it will automatically insert messages into the transport.
 * // Otherwise, you can insert messages manually.
 * transport.insert({
 *   level: 'info',
 *   labels: ['server'],
 *   message: 'test message',
 *   timestamp: Date.now(),
 * })
 *
 * process.on('SIGINT', async () => {
 *   await transport.stop()
 *   process.exit(0)
 * })
 * ```
 */
export class Transport {
  private enabled = true
  /**
   * Registered flush handlers keyed by name.
   */
  public handlers: Map<string, TransportHandler> = new Map()
  private logger: Logger
  /**
   * Buffered messages waiting to be flushed.
   */
  public messages: LoggerMessage[] = []
  private flushing = false
  private interval: NodeJS.Timeout | undefined
  private intervalTime = 5000

  /**
   * Create the shared transport and start its flush interval.
   */
  constructor() {
    this.logger = new Logger('LoggerTransport')
    this.logger.level = 'info'
    this.interval = setInterval(this.flush.bind(this), this.intervalTime)
  }

  /**
   * Register a named flush handler.
   *
   * Registering the same name again replaces the previous handler.
   *
   * @param {string} name - Transport handler name.
   * @param {TransportHandler} handler - Async handler invoked for each flushed batch.
   */
  register(name: string, handler: TransportHandler) {
    this.logger.info('register', name)

    this.handlers.set(name, handler)

    if (!this.enabled) this.enabled = true
  }

  /**
   * Remove a named handler from the transport.
   *
   * When the last handler is removed, the transport stops accepting new messages until it is re-enabled.
   *
   * @param {string} name - Transport handler name to remove.
   */
  unregister(name: string) {
    this.logger.info('unregister', name)

    this.handlers.delete(name)

    if (this.handlers.size === 0) this.enabled = false
  }

  /**
   * Queue a formatted log message for the next flush.
   *
   * This is a no-op when the transport is disabled.
   *
   * @param {LoggerMessage} message - Log message to buffer.
   */
  insert(message: LoggerMessage) {
    if (!this.enabled) return

    this.messages.push(message)
  }

  /**
   * Flush the current message buffer through every registered handler.
   *
   * Concurrent callers wait for the active flush to finish. If no handlers are registered, the transport clears
   * the buffered messages, disables itself, and stops the interval until reconfigured.
   *
   * @returns {Promise<void>} Promise that resolves after the active flush completes.
   */
  async flush() {
    if (this.flushing)
      return new Promise<void>((resolve) => {
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

    this.logger.debug('flushing %d messages with %d handlers', messages.length, this.handlers.size)

    for (const handler of this.handlers.values())
      try {
        await handler(messages)
      } catch (error) {
        this.logger.error(handler.name, error)
      }

    this.flushing = false
  }

  /**
   * Stop periodic flushing and drain any buffered messages.
   *
   * @returns {Promise<void>} Promise that resolves when the transport has fully stopped.
   */
  async stop() {
    this.logger.info('stopping')

    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }

    await this.flush()

    this.enabled = false
  }

  /**
   * Clear handlers and buffered messages without destroying the singleton instance.
   *
   * This also clears the interval so tests or setup code can reconfigure the transport from a clean state.
   */
  reset() {
    this.handlers.clear()
    this.messages.splice(0, this.messages.length)
    this.enabled = true

    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }
  }

  /**
   * Update runtime options for the shared transport logger.
   *
   * Calling this method also re-enables a previously disabled transport.
   *
   * @param {TransportOptions} options - Transport configuration such as label, flush interval, and debug mode.
   */
  config(options: TransportOptions) {
    if (options.label) this.logger.label = options.label

    if (typeof options.debug === 'boolean') this.logger.level = options.debug ? 'debug' : 'info'

    if (options.interval && options.interval !== this.intervalTime) {
      this.intervalTime = options.interval
      clearInterval(this.interval)
      this.interval = setInterval(this.flush.bind(this), this.intervalTime)
    }

    if (!this.enabled) this.enabled = true
  }
}

let current: Transport

/**
 * Return the singleton transport used by {@link Logger}.
 *
 * The instance is created lazily on first access.
 *
 * @returns {Transport} Shared transport instance.
 * @example
 * ```ts
 * import { getTransport, Logger } from '@faasjs/node-utils'
 *
 * const transport = getTransport()
 *
 * transport.register('console', async (messages) => {
 *   console.log(messages.length)
 * })
 *
 * new Logger('app').info('hello')
 * await transport.flush()
 * ```
 */
export function getTransport() {
  current ||= new Transport()

  return current
}
