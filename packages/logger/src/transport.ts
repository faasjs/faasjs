import type { Level } from './logger'

export type LoggerMessage = {
  level: Level
  message: string
  timestamp: number
}

export type TransportHandler = (messages: LoggerMessage[]) => Promise<void>

export const Transports = new Map<string, TransportHandler>()

export function register(name: string, handler: TransportHandler) {
  Transports.set(name, handler)
}

export function unregister(name: string) {
  Transports.delete(name)
}

export const CachedMessages: LoggerMessage[] = []

let running = false

process
  .on('SIGTERM', async () => {
    if (running) return

    if (CachedMessages.length)
      await run()
  })
  .on('SIGINT', async () => {
    if (running) return

    if (CachedMessages.length)
      await run()
  })

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

setInterval(() => {
  if (CachedMessages.length > 0) run()
}, 5000)
