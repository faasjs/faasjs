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
 */
export function register(name: string, handler: TransportHandler) {
  Transports.set(name, handler)
}

/**
 * Unregister a transport by its name.
 *
 * @param name - The name of the transport to unregister.
 */
export function unregister(name: string) {
  Transports.delete(name)
}

export const CachedMessages: LoggerMessage[] = []

let running = false

export function insert(level: Level, message: string, timestamp: number) {
  CachedMessages.push({ level, message, timestamp })
}

export async function run() {
  if (running) return

  running = true
  const messages = CachedMessages.splice(0, CachedMessages.length)

  for (const handler of Transports.values())
    try {
      await handler(messages)
    } catch (error) {
      console.error(error)
    }

  running = false
}

export function start() {
  process
    .on('SIGTERM', async () => {
      if (CachedMessages.length) await run()

      process.exit(0)
    })
    .on('SIGINT', async () => {
      if (CachedMessages.length) await run()

      process.exit(0)
    })

  setInterval(() => {
    if (CachedMessages.length > 0) run()
  }, 5000)
}
