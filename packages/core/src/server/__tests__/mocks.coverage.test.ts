import { afterEach, describe, expect, it, vi } from 'vitest'

import { createMockReq, createMockRes, triggerReqEvents } from '../mocks'

describe('server mocks coverage', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should read request bodies only once and support defaults', () => {
    const req = createMockReq()

    expect(req.method).toBe('GET')
    expect(req.url).toBe('/')
    expect(req.headers).toEqual({})
    expect(req.read()).toBeNull()

    const bodyReq = createMockReq({
      method: 'POST',
      url: '/demo',
      headers: { test: 'ok' },
      body: 'payload',
    })

    expect(bodyReq.read()?.toString()).toBe('payload')
    expect(bodyReq.read()).toBeNull()
  })

  it('should capture writes and optional end payloads', async () => {
    vi.useFakeTimers()
    const onDataCapture = vi.fn()
    const res = createMockRes({ onDataCapture })
    const finish = vi.fn()

    res.once('finish', finish)
    res.write('chunk')

    expect(res._capturedData).toBe('chunk')
    expect(onDataCapture).toHaveBeenCalledWith('chunk')

    res.end('done')
    await vi.runAllTimersAsync()

    expect(res.writableEnded).toBe(true)
    expect(res.headersSent).toBe(true)
    expect(res._capturedData).toBe('done')
    expect(finish).toHaveBeenCalledTimes(1)

    const emptyEnd = createMockRes()
    emptyEnd.end()
    expect(emptyEnd._capturedData).toBeNull()
  })

  it('should emit readable and end events for request helpers', async () => {
    vi.useFakeTimers()
    const req = createMockReq({ body: 'payload' })
    const readable = vi.fn()
    const end = vi.fn()

    req.on('readable', readable)
    req.on('end', end)

    triggerReqEvents(req)
    await vi.runAllTimersAsync()

    expect(readable).toHaveBeenCalledTimes(1)
    expect(end).toHaveBeenCalledTimes(1)
  })
})
