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

/**
 * The transport class that manages the transport handlers and log messages.
 *
 * **Note: This class is not meant to be used directly. Use the {@link getTransport} instead.**
 *
 * @example
 * ```typescript
 * import { getTransport } from '@faasjs/logger'
 *
 * const transport = getTransport()
 *
 * transport.register('test', async (messages) => {
 *  for (const { level, message } of messages)
 *    console.log(level, message)
 * })
 *
 * transport.config({ label: 'test', debug: true })
 *
 * // If you using Logger, it will automatically insert messages to the transport.
 * // Otherwise, you can insert messages manually.
 * transport.insert({
 *   level: 'info',
 *   labels: ['server'],
 *   message: 'test message',
 *   timestamp: Date.now()
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
  public handlers: Map<string, TransportHandler> = new Map()
  private logger: Logger
  public messages: LoggerMessage[] = []
  private flushing = false
  private interval: NodeJS.Timeout | undefined
  private intervalTime = 5000

  constructor() {
    this.logger = new Logger('LoggerTransport')
    this.logger.level = 'info'

    this.flush = this.flush.bind(this)

    this.interval = setInterval(this.flush, this.intervalTime)
  }

  /**
   * Registers a new transport handler.
   *
   * @param name - The name of the transport handler.
   * @param handler - The transport handler function to be registered.
   */
  register(name: string, handler: TransportHandler) {
    this.logger.info('register', name)

    this.handlers.set(name, handler)

    if (!this.enabled) this.enabled = true
  }

  /**
   * Unregister a handler by its name.
   *
   * This method logs the unregistration process, removes the handler from the internal collection,
   * and disables the logger if no handlers remain.
   *
   * @param name - The name of the handler to unregister.
   */
  unregister(name: string) {
    this.logger.info('unregister', name)

    this.handlers.delete(name)

    if (this.handlers.size === 0) this.enabled = false
  }

  /**
   * Inserts a log message into the transport if it is enabled.
   *
   * @param message - The log message to be inserted.
   */
  insert(message: LoggerMessage) {
    if (!this.enabled) return

    this.messages.push(message)
  }

  /**
   * Flushes the current messages by processing them with the registered handlers.
   *
   * If the transport is already flushing, it will wait until the current flush is complete.
   * If the transport is disabled or there are no messages to flush, it will return immediately.
   * If there are no handlers registered, it will log a warning, clear the messages, disable the transport, and stop the interval.
   *
   * The method processes all messages with each handler and logs any errors encountered during the process.
   *
   * @returns {Promise<void>} A promise that resolves when the flush operation is complete.
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
   * Stops the logger transport.
   *
   * This method performs the following actions:
   * 1. Logs a 'stopping' message.
   * 2. Clears the interval if it is set.
   * 3. Flushes any remaining logs.
   * 4. Disables the transport.
   *
   * @returns {Promise<void>} A promise that resolves when the transport has been stopped.
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
   * Resets the transport by clearing handlers, emptying messages, and re-enabling the transport.
   * If an interval is set, it will be cleared.
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
   * Configure the transport options for the logger.
   *
   * @param {TransportOptions} options - The configuration options for the transport.
   * @param {string} [options.label] - The label to be used by the logger.
   * @param {boolean} [options.debug] - If true, sets the logger level to 'debug', otherwise sets it to 'info'.
   * @param {number} [options.interval] - The interval time in milliseconds for flushing the logs. If different from the current interval, it updates the interval and resets the timer.
   */
  config(options: TransportOptions) {
    if (options.label) this.logger.label = options.label

    if (typeof options.debug === 'boolean') this.logger.level = options.debug ? 'debug' : 'info'

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
