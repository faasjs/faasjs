import { describe, expect, it } from 'vitest'

import { createMockReq, createMockRes } from '../mocks'
import {
  getErrorStatusCode,
  respond,
  respondWithError,
  respondWithInternalServerError,
  respondWithJsonError,
} from '../response'

describe('response', () => {
  it('should resolve status code and message with fallback rules', () => {
    expect(getErrorStatusCode(undefined)).toBeUndefined()
    expect(getErrorStatusCode({ statusCode: Number.NaN })).toBeUndefined()
    expect(getErrorStatusCode({ statusCode: 418 })).toBe(418)
  })

  it('should respond with json payload when headers are not sent', () => {
    let responseData = ''
    const res = createMockRes({
      onDataCapture(data) {
        responseData = Buffer.isBuffer(data) ? data.toString() : String(data)
      },
    })

    respondWithJsonError(res as any, 400, 'bad request')

    expect(res.statusCode).toBe(400)
    expect(res.headers['Content-Type']).toBe('application/json; charset=utf-8')
    expect(responseData).toBe('{"error":{"message":"bad request"}}')
    expect(res.writableEnded).toBe(true)
  })

  it('should skip json payload when response already started or ended', () => {
    const startedRes = createMockRes()
    startedRes.headersSent = true

    respondWithJsonError(startedRes as any, 500, 'error')

    expect(startedRes.statusCode).toBe(200)
    expect(startedRes.writableEnded).toBe(true)
    expect(startedRes._capturedData).toBeNull()

    const endedRes = createMockRes()
    endedRes.writableEnded = true

    respondWithJsonError(endedRes as any, 500, 'error')

    expect(endedRes.statusCode).toBe(200)
    expect(endedRes.writableEnded).toBe(true)
    expect(endedRes._capturedData).toBeNull()
  })

  it('should respond with internal server error text when headers are not sent', () => {
    let responseData = ''
    const res = createMockRes({
      onDataCapture(data) {
        responseData = Buffer.isBuffer(data) ? data.toString() : String(data)
      },
    })

    respondWithInternalServerError(res as any)

    expect(res.statusCode).toBe(500)
    expect(res.headers['Content-Type']).toBe('text/plain; charset=utf-8')
    expect(responseData).toBe('Internal Server Error')
    expect(res.writableEnded).toBe(true)
  })

  it('should skip internal server error payload when response already started or ended', () => {
    const startedRes = createMockRes()
    startedRes.headersSent = true

    respondWithInternalServerError(startedRes as any)

    expect(startedRes.statusCode).toBe(200)
    expect(startedRes.writableEnded).toBe(true)
    expect(startedRes._capturedData).toBeNull()

    const endedRes = createMockRes()
    endedRes.writableEnded = true

    respondWithInternalServerError(endedRes as any)

    expect(endedRes.statusCode).toBe(200)
    expect(endedRes.writableEnded).toBe(true)
    expect(endedRes._capturedData).toBeNull()
  })

  describe('respondWithError', () => {
    it('should write JSON error for Error instances with status code', () => {
      let responseData = ''
      const res = createMockRes({
        onDataCapture(data) {
          responseData = Buffer.isBuffer(data) ? data.toString() : String(data)
        },
      })
      const error = new Error('Something went wrong')
      ;(error as any).statusCode = 400

      respondWithError(error, res as any, 400)

      expect(res.statusCode).toBe(400)
      expect(res.headers['Content-Type']).toBe('application/json; charset=utf-8')
      expect(responseData).toBe('{"error":{"message":"Something went wrong"}}')
      expect(res.writableEnded).toBe(true)
    })

    it('should write internal server error for Error-like without status code', () => {
      let responseData = ''
      const res = createMockRes({
        onDataCapture(data) {
          responseData = Buffer.isBuffer(data) ? data.toString() : String(data)
        },
      })

      respondWithError(new Error('boom'), res as any, undefined)

      expect(res.statusCode).toBe(500)
      expect(res.headers['Content-Type']).toBe('text/plain; charset=utf-8')
      expect(responseData).toBe('Internal Server Error')
      expect(res.writableEnded).toBe(true)
    })

    it('should write body for non-error data', () => {
      let responseData = ''
      const res = createMockRes({
        onDataCapture(data) {
          responseData = Buffer.isBuffer(data) ? data.toString() : String(data)
        },
      })

      respondWithError({ body: 'hello' }, res as any, 200)

      expect(res.statusCode).toBe(200)
      expect(responseData).toBe('hello')
      expect(res.writableEnded).toBe(true)
    })

    it('should end response even with empty body', () => {
      const res = createMockRes()

      respondWithError({}, res as any, 201)

      expect(res.statusCode).toBe(201)
      expect(res.writableEnded).toBe(true)
    })
  })

  describe('respond', () => {
    it('should write a normal JSON response', async () => {
      let responseData = ''
      const req = createMockReq({ url: '/test' })
      const res = createMockRes({
        onDataCapture(data) {
          responseData = Buffer.isBuffer(data) ? data.toString() : String(data)
        },
      })

      await respond({ body: '{"data":"ok"}' }, req as any, res as any, {
        requestId: 'test-id',
        requestedAt: 1000,
        startedAt: 1100,
        logger: { debug() {}, error() {}, info() {}, label: 'test' } as any,
        onError() {},
      })

      expect(res.statusCode).toBe(200)
      expect(res.writableEnded).toBe(true)
      expect(responseData).toBe('{"data":"ok"}')
    })

    it('should handle Error data as 500 JSON response', async () => {
      let responseData = ''
      const req = createMockReq({ url: '/error' })
      const res = createMockRes({
        onDataCapture(data) {
          responseData = Buffer.isBuffer(data) ? data.toString() : String(data)
        },
      })
      const error = new Error('fail')
      ;(error as any).statusCode = 500

      await respond(error, req as any, res as any, {
        requestId: 'test-id',
        requestedAt: 1000,
        startedAt: 1100,
        logger: { debug() {}, error() {}, info() {}, label: 'test' } as any,
        onError() {},
      })

      expect(res.statusCode).toBe(500)
      expect(res.headers['Content-Type']).toBe('application/json; charset=utf-8')
      expect(responseData).toBe('{"error":{"message":"fail"}}')
      expect(res.writableEnded).toBe(true)
    })
  })
})
