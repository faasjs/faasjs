import type { IncomingMessage } from 'node:http'
import { describe, expect, it } from 'vitest'
import { BAD_REQUEST_URL_MESSAGE, ensureRequestUrl } from '../request-url'
import { createMockRes } from '../server/__tests__/mocks'

describe('ensureRequestUrl', () => {
  it('should return request url', () => {
    const req = { url: '/hello' } as IncomingMessage
    const res = createMockRes()

    expect(ensureRequestUrl(req, res as any)).toBe('/hello')
    expect(res.statusCode).toBe(200)
    expect(res.writableEnded).toBe(false)
  })

  it('should respond with 400 if request url is missing', () => {
    let responseData: any = null
    const req = { url: undefined } as unknown as IncomingMessage
    const res = createMockRes({
      onDataCapture: (data: any) => {
        responseData = Buffer.isBuffer(data) ? data.toString() : data
      },
    })

    expect(ensureRequestUrl(req, res as any)).toBeUndefined()
    expect(res.statusCode).toBe(400)
    expect(res.headers['Content-Type']).toBe('text/plain; charset=utf-8')
    expect(responseData).toBe(BAD_REQUEST_URL_MESSAGE)
    expect(res.writableEnded).toBe(true)
  })
})
