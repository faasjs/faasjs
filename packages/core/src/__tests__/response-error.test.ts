import { describe, expect, it } from 'vitest'
import {
  getErrorMessage,
  getErrorStatusCode,
  INTERNAL_SERVER_ERROR_MESSAGE,
  respondWithInternalServerError,
  respondWithJsonError,
} from '../response-error'
import { createMockRes } from '../server/__tests__/mocks'

describe('response-error', () => {
  it('should resolve status code and message with fallback rules', () => {
    expect(getErrorStatusCode(undefined)).toBeUndefined()
    expect(getErrorStatusCode({ statusCode: Number.NaN })).toBeUndefined()
    expect(getErrorStatusCode({ statusCode: 418 })).toBe(418)

    expect(getErrorMessage({ message: '' })).toBe(INTERNAL_SERVER_ERROR_MESSAGE)
    expect(getErrorMessage({ message: 1 })).toBe(INTERNAL_SERVER_ERROR_MESSAGE)
    expect(getErrorMessage({ message: 'teapot' }, 'fallback')).toBe('teapot')
    expect(getErrorMessage(null, 'fallback')).toBe('fallback')
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
    expect(responseData).toBe(INTERNAL_SERVER_ERROR_MESSAGE)
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
})
