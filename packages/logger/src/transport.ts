import { type Level, Logger } from './logger'

export type LoggerMessage = {
  level: Level
  labels: string[]
  message: string
  timestamp: number
  extra?: any[]
}

export type TransportHandler = (messages: LoggerMessage[]) => Promise<void>

export const TransportHandlers = new Map<string, TransportHandler>()

let _logger: Logger

function logger() {
  if (!_logger) _logger = new Logger('LoggerTransport')

  return _logger
}

let enabled = true

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
export function registerTransportHandler(name: string, handler: TransportHandler) {
  logger().info('register', name)
  TransportHandlers.set(name, handler)
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
  logger().info('unregister', name)
  TransportHandlers.delete(name)
}

export const CachedMessages: LoggerMessage[] = []

let flushing = false

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
  if (!enabled) return
  CachedMessages.push(message)
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
  if (flushing)
    return new Promise<void>(resolve => {
      const interval = setInterval(() => {
        if (!flushing) {
          clearInterval(interval)
          resolve()
        }
      }, 100)
    })

  flushing = true

  const messages = CachedMessages.splice(0, CachedMessages.length)

  for (const handler of TransportHandlers.values())
    try {
      await handler(messages)
    } catch (error) {
      logger().error(handler.name, error)
    }

  flushing = false
}

export type StartOptions = {
  /** @default 5000 */
  interval?: number
}

let started = false
let interval: NodeJS.Timeout

/**
 * Starts the logging transport with the specified options.
 *
 * This function sets a timeout to periodically flush cached messages.
 * If there are any cached messages, it will flush them and then restart the process.
 *
 * @param {StartOptions} [options={}] - The options to configure the logging transport.
 * @param {number} [options.interval=5000] - The interval in milliseconds at which to flush cached messages.
 *
 * @example
 * ```typescript
 * import { start } from '@faasjs/logger/transport'
 *
 * start()
 * ```
 */
export function startTransport(options: StartOptions = {}) {
  if (!enabled) enabled = true

  if (started) {
    logger().warn('already started')
    return
  }

  interval = setTimeout(async () => {
    if (CachedMessages.length > 0) await flushTransportMessages()

    if (started) startTransport()
  }, options.interval ?? 5000)

  logger().info('started %j', options)
}

/**
 * Stops the logging transport.
 *
 * If there are any cached messages, it flushes them.
 *
 * @returns {Promise<void>} A promise that resolves when the logging transport is stopped.
 */
export async function stopTransport() {
  if (!enabled) return

  started = false

  if (interval) {
    clearInterval(interval)
    interval = undefined
  }

  logger().info('stopping')

  await flushTransportMessages()

  logger().info('stopped')

  await flushTransportMessages()
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
  enabled = true
  TransportHandlers.clear()
  CachedMessages.splice(0, CachedMessages.length)
}

setTimeout(async () => {
  if (Object.keys(TransportHandlers).length === 0) {
    logger().warn('no transports registered, auto disabled')
    enabled = false
  }
}, 5000)
