import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  CachedMessages,
  Transports,
  flush,
  insert,
  register,
  reset,
  start,
  stop,
  unregister,
} from '../transport'
import type { TransportHandler } from '../transport'

describe('transport', () => {
  afterEach(() => {
    reset()
  })

  it('should register a transport handler', () => {
    const handler: TransportHandler = async () => { }

    register('test', handler)

    expect(Transports.has('test')).toBe(true)
  })

  it('should unregister a transport handler', () => {
    const handler: TransportHandler = async () => { }

    register('test', handler)

    unregister('test')

    expect(Transports.has('test')).toBe(false)
  })

  it('should insert messages into cache', () => {
    const level = 'info'
    const message = 'test message'
    const timestamp = Date.now()

    insert({ level, labels: [], message, timestamp })

    expect(CachedMessages.length).toBe(1)
    expect(CachedMessages[0]).toEqual({ level, labels: [], message, timestamp })
  })

  it('should flush transport handlers with cached messages', async () => {
    const handler: TransportHandler = vi.fn(async () => { })

    register('test', handler)

    const level = 'info'
    const message = 'test message'
    const timestamp = Date.now()

    CachedMessages.splice(0, CachedMessages.length)

    insert({ level, labels: [], message, timestamp })

    await Promise.all([flush(), flush()])

    expect(handler).toHaveBeenCalledWith([
      { level, labels: [], message, timestamp },
    ])
  })

  it('should handle errors in transport handlers', async () => {
    const error = new Error('test error')

    const handler: TransportHandler = vi.fn(async () => {
      throw error
    })

    register('test', handler)

    const level = 'info'
    const message = 'test message'
    const timestamp = Date.now()

    CachedMessages.splice(0, CachedMessages.length)

    insert({ level, labels: [], message, timestamp })

    await flush()

    expect(CachedMessages[0]).toMatchObject({
      labels: ['LoggerTransport'],
      level: 'error',
      extra: [error]
    })
  })

  it('should start and periodically flush cached messages', async () => {
    vi.useFakeTimers()

    start({ interval: 1000 })
    start()

    CachedMessages.splice(0, CachedMessages.length)

    insert({
      level: 'info',
      labels: [],
      message: 'test message',
      timestamp: Date.now(),
    })

    vi.advanceTimersByTime(1000)

    expect(CachedMessages).toHaveLength(0)

    insert({
      level: 'info',
      labels: [],
      message: 'test message',
      timestamp: Date.now(),
    })

    await stop()

    insert({
      level: 'info',
      labels: [],
      message: 'test message',
      timestamp: Date.now(),
    })

    vi.advanceTimersByTime(1000)

    expect(CachedMessages).toHaveLength(1)
    expect(CachedMessages[0]).toMatchObject({
      level: 'info',
      labels: [],
      message: 'test message',
    })

    vi.useRealTimers()
  })
})
