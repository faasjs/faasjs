import type { Level } from './logger'

export type LoggerMessage = {
  level: Level
  message: string
  timestamp: number
}

export type TransportHandler = (messages: LoggerMessage[]) => Promise<void>

export const Transports = new Map<string, TransportHandler>()

/**
 * Registers a transport handler with a given name.
 *
 * @param name - The name of the transport handler.
 * @param handler - The transport handler to be registered.
 *
 * @example
 * ```typescript
 * import { register } from '@faasjs/logger/transport'
 *
 * register('test', async (messages) => {
 *  for (const { level, message } of messages)
 *   console.log(level, message)
 * })
 * ```
 */
export function register(name: string, handler: TransportHandler) {
  Transports.set(name, handler)
}

/**
 * Unregister a transport by its name.
 *
 * @param name - The name of the transport to unregister.
 *
 * @example
 * ```typescript
 * import { unregister } from '@faasjs/logger/transport'
 *
 * unregister('test')
 * ```
 */
export function unregister(name: string) {
  Transports.delete(name)
}

export const CachedMessages: LoggerMessage[] = []

let flushing = false

/**
 * Inserts a log message into the cache.
 *
 * @param level - The level of the log message.
 * @param message - The log message to be inserted.
 * @param timestamp - The timestamp when the log message was created.
 *
 * @example
 *
 * ```typescript
 * import { insert } from '@faasjs/logger/transport'
 *
 * insert('info', 'test message', Date.now())
 * ```
 */
export function insert(level: Level, message: string, timestamp: number) {
  CachedMessages.push({ level, message, timestamp })
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
 * import { flush } from '@faasjs/logger/transport'
 *
 * process.on('SIGINT', async () => {
 *   await flush()
 *   process.exit(0)
 * })
 * ```
 */
export async function flush() {
  if (flushing) return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (!flushing) {
        clearInterval(interval)
        resolve()
      }
    }, 100)
  })

  flushing = true
  const messages = CachedMessages.splice(0, CachedMessages.length)

  for (const handler of Transports.values())
    try {
      await handler(messages)
    } catch (error) {
      console.error('LoggerTransportError', handler.name, error)
    }

  flushing = false
}

export type StartOptions = {
  /** @default 5000 */
  interval?: number
}

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
export function start(options: StartOptions = {}) {
  setTimeout(async () => {
    if (CachedMessages.length > 0)
      await flush()

    start()
  }, options.interval ?? 5000)
}
