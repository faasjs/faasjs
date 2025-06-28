import { afterEach, describe, expect, it, vi } from 'vitest'
import type { TransportHandler } from '../transport'
import { getTransport } from '../transport'

describe('transport', () => {
  afterEach(() => {
    getTransport().reset()
  })

  it('should register a transport handler', () => {
    const handler: TransportHandler = async () => {}

    getTransport().register('test', handler)

    expect(getTransport().handlers.has('test')).toBe(true)
  })

  it('should unregister a transport handler', () => {
    const handler: TransportHandler = async () => {}

    getTransport().register('test', handler)

    getTransport().unregister('test')

    expect(getTransport().handlers.has('test')).toBe(false)
  })

  it('should insert messages into cache', () => {
    const level = 'info'
    const message = 'test message'
    const timestamp = Date.now()

    getTransport().insert({ level, labels: [], message, timestamp })

    expect(getTransport().messages.length).toBe(1)
    expect(getTransport().messages[0]).toEqual({
      level,
      labels: [],
      message,
      timestamp,
    })
  })

  it('should flush transport handlers with cached messages', async () => {
    const handler: TransportHandler = vi.fn(async () => {})

    const transport = getTransport()

    transport.register('test', handler)

    const level = 'info'
    const message = 'test message'
    const timestamp = Date.now()

    transport.messages.splice(0, transport.messages.length)

    transport.insert({ level, labels: [], message, timestamp })

    await Promise.all([transport.flush(), transport.flush()])

    expect(handler).toHaveBeenCalledWith([
      { level, labels: [], message, timestamp },
    ])
  })

  it('should handle errors in transport handlers', async () => {
    const error = new Error('test error')
    const transport = getTransport()

    const handler: TransportHandler = vi.fn(async () => {
      throw error
    })

    transport.register('test', handler)

    const level = 'info'
    const message = 'test message'
    const timestamp = Date.now()

    transport.messages.splice(0, transport.messages.length)

    transport.insert({ level, labels: [], message, timestamp })

    await transport.flush()

    expect(transport.messages[0]).toMatchObject({
      labels: ['LoggerTransport'],
      level: 'error',
      extra: [error],
    })
  })

  it('should start and periodically flush cached messages', async () => {
    vi.useFakeTimers()

    const transport = getTransport()

    transport.config({ interval: 1000 })
    transport.config({})

    transport.messages.splice(0, transport.messages.length)

    transport.insert({
      level: 'info',
      labels: [],
      message: 'test message',
      timestamp: Date.now(),
    })

    vi.advanceTimersByTime(1000)

    expect(transport.messages).toHaveLength(0)

    transport.insert({
      level: 'info',
      labels: [],
      message: 'test message',
      timestamp: Date.now(),
    })

    await transport.stop()

    transport.insert({
      level: 'info',
      labels: [],
      message: 'test message',
      timestamp: Date.now(),
    })

    vi.advanceTimersByTime(1000)

    expect(transport.messages).toHaveLength(0)

    vi.useRealTimers()
  })
})
