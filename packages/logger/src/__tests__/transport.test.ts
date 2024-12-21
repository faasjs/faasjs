import {
  CachedMessages,
  Transports,
  insert,
  register,
  run,
  unregister,
} from '../transport'
import type { TransportHandler } from '../transport'

describe('transport', () => {
  afterEach(() => {
    Transports.clear()
    CachedMessages.splice(0, CachedMessages.length)
  })

  it('should register a transport handler', () => {
    const handler: TransportHandler = async () => {}

    register('test', handler)

    expect(Transports.has('test')).toBe(true)
  })

  it('should unregister a transport handler', () => {
    const handler: TransportHandler = async () => {}

    register('test', handler)

    unregister('test')

    expect(Transports.has('test')).toBe(false)
  })

  it('should insert messages into cache', () => {
    const level = 'info'
    const message = 'test message'
    const timestamp = Date.now()

    insert(level, message, timestamp)

    expect(CachedMessages.length).toBe(1)
    expect(CachedMessages[0]).toEqual({ level, message, timestamp })
  })

  it('should run transport handlers with cached messages', async () => {
    const handler: TransportHandler = jest.fn(async () => {})

    register('test', handler)

    const level = 'info'
    const message = 'test message'
    const timestamp = Date.now()

    insert(level, message, timestamp)

    await run()

    expect(handler).toHaveBeenCalledWith([{ level, message, timestamp }])
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

    insert(level, message, timestamp)

    console.error = jest.fn()

    await run()

    expect(console.error).toHaveBeenCalledWith(error)
  })
})
