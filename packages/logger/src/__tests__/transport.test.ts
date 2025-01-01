import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  flushTransportMessages,
  getTransport,
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
    const handler: TransportHandler = async () => { }

    registerTransportHandler('test', handler)

    expect(getTransport().handlers.has('test')).toBe(true)
  })

  it('should unregister a transport handler', () => {
    const handler: TransportHandler = async () => { }

    registerTransportHandler('test', handler)

    unregisterTransportHandler('test')

    expect(getTransport().handlers.has('test')).toBe(false)
  })

  it('should insert messages into cache', () => {
    const level = 'info'
    const message = 'test message'
    const timestamp = Date.now()

    insertMessageToTransport({ level, labels: [], message, timestamp })

    expect(getTransport().messages.length).toBe(1)
    expect(getTransport().messages[0]).toEqual({ level, labels: [], message, timestamp })
  })

  it('should flush transport handlers with cached messages', async () => {
    const handler: TransportHandler = vi.fn(async () => { })

    registerTransportHandler('test', handler)

    const level = 'info'
    const message = 'test message'
    const timestamp = Date.now()

    getTransport().messages.splice(0, getTransport().messages.length)

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

    getTransport().messages.splice(0, getTransport().messages.length)

    insertMessageToTransport({ level, labels: [], message, timestamp })

    await flushTransportMessages()

    expect(getTransport().messages[0]).toMatchObject({
      labels: ['LoggerTransport'],
      level: 'error',
      extra: [error],
    })
  })

  it('should start and periodically flush cached messages', async () => {
    vi.useFakeTimers()

    startTransport({ interval: 1000 })
    startTransport()

    getTransport().messages.splice(0, getTransport().messages.length)

    insertMessageToTransport({
      level: 'info',
      labels: [],
      message: 'test message',
      timestamp: Date.now(),
    })

    vi.advanceTimersByTime(1000)

    expect(getTransport().messages).toHaveLength(0)

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

    expect(getTransport().messages).toHaveLength(0)

    vi.useRealTimers()
  })
})
