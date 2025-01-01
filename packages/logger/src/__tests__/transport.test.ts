import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  CachedMessages,
  TransportHandlers,
  flushTransportMessages,
  insertMessageToTransport,
  registerTransportHandler,
  resetTransport,
  startTransport,
  stopTransport,
  unregisterTransportHandler,
} from '../transport'
import type { TransportHandler } from '../transport'

describe('transport', () => {
  afterEach(() => {
    resetTransport()
  })

  it('should register a transport handler', () => {
    const handler: TransportHandler = async () => {}

    registerTransportHandler('test', handler)

    expect(TransportHandlers.has('test')).toBe(true)
  })

  it('should unregister a transport handler', () => {
    const handler: TransportHandler = async () => {}

    registerTransportHandler('test', handler)

    unregisterTransportHandler('test')

    expect(TransportHandlers.has('test')).toBe(false)
  })

  it('should insert messages into cache', () => {
    const level = 'info'
    const message = 'test message'
    const timestamp = Date.now()

    insertMessageToTransport({ level, labels: [], message, timestamp })

    expect(CachedMessages.length).toBe(1)
    expect(CachedMessages[0]).toEqual({ level, labels: [], message, timestamp })
  })

  it('should flush transport handlers with cached messages', async () => {
    const handler: TransportHandler = vi.fn(async () => {})

    registerTransportHandler('test', handler)

    const level = 'info'
    const message = 'test message'
    const timestamp = Date.now()

    CachedMessages.splice(0, CachedMessages.length)

    insertMessageToTransport({ level, labels: [], message, timestamp })

    await Promise.all([flushTransportMessages(), flushTransportMessages()])

    expect(handler).toHaveBeenCalledWith([
      { level, labels: [], message, timestamp },
    ])
  })

  it('should handle errors in transport handlers', async () => {
    const error = new Error('test error')

    const handler: TransportHandler = vi.fn(async () => {
      throw error
    })

    registerTransportHandler('test', handler)

    const level = 'info'
    const message = 'test message'
    const timestamp = Date.now()

    CachedMessages.splice(0, CachedMessages.length)

    insertMessageToTransport({ level, labels: [], message, timestamp })

    await flushTransportMessages()

    expect(CachedMessages[1]).toMatchObject({
      labels: ['LoggerTransport'],
      level: 'error',
      extra: [error],
    })
  })

  it('should start and periodically flush cached messages', async () => {
    vi.useFakeTimers()

    startTransport({ interval: 1000 })
    startTransport()

    CachedMessages.splice(0, CachedMessages.length)

    insertMessageToTransport({
      level: 'info',
      labels: [],
      message: 'test message',
      timestamp: Date.now(),
    })

    vi.advanceTimersByTime(1000)

    expect(CachedMessages).toHaveLength(1)

    insertMessageToTransport({
      level: 'info',
      labels: [],
      message: 'test message',
      timestamp: Date.now(),
    })

    await stopTransport()

    insertMessageToTransport({
      level: 'info',
      labels: [],
      message: 'test message',
      timestamp: Date.now(),
    })

    vi.advanceTimersByTime(1000)

    expect(CachedMessages).toHaveLength(0)

    vi.useRealTimers()
  })
})
