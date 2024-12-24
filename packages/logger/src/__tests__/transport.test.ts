import {
  CachedMessages,
  Transports,
  flush,
  insert,
  register,
  start,
  stop,
  unregister,
} from '../transport'
import type { TransportHandler } from '../transport'

describe('transport', () => {
  afterEach(() => {
    Transports.clear()
    CachedMessages.splice(0, CachedMessages.length)
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

    insert(level, [], message, timestamp)

    expect(CachedMessages.length).toBe(1)
    expect(CachedMessages[0]).toEqual({ level, labels: [], message, timestamp })
  })

  it('should flush transport handlers with cached messages', async () => {
    const handler: TransportHandler = jest.fn(async () => { })

    register('test', handler)

    const level = 'info'
    const message = 'test message'
    const timestamp = Date.now()

    insert(level, [], message, timestamp)

    await Promise.all([flush(), flush()])

    expect(handler).toHaveBeenCalledWith([{ level, labels: [], message, timestamp }])
  })

  it('should handle errors in transport handlers', async () => {
    const error = new Error('test error')

    const handler: TransportHandler = jest.fn(async () => {
      throw error
    })

    register('test', handler)

    const level = 'info'
    const message = 'test message'
    const timestamp = Date.now()

    insert(level, [], message, timestamp)

    console.error = jest.fn()

    await flush()

    expect(console.error).toHaveBeenCalledWith(
      '[LoggerTransport]',
      'mockConstructor',
      error
    )
  })

  it('should start and periodically flush cached messages', async () => {
    jest.useFakeTimers()

    start({ interval: 1000 })
    start()

    insert('info', [], 'test message', Date.now())

    jest.advanceTimersByTime(1000)

    expect(CachedMessages).toHaveLength(0)

    insert('info', [], 'test message', Date.now())

    await stop()

    insert('info', [], 'test message', Date.now())

    jest.advanceTimersByTime(1000)

    expect(CachedMessages).toHaveLength(1)

    jest.useRealTimers()
  })
})
