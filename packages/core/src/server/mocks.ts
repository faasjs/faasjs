import { EventEmitter } from 'node:events'
import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * Mock request object used for testing server request handling.
 *
 * Combines a Node.js `EventEmitter` with the `IncomingMessage` interface and
 * adds a lightweight `read()` implementation for simulating streamed request bodies.
 */
export type MockRequest = EventEmitter &
  IncomingMessage & {
    _body: string | null
    _readIndex: number
    read(): Buffer | null
  }

/**
 * Create a mock `IncomingMessage` compatible with FaasJS server internals.
 *
 * The returned request object emits `readable` and `end` events when triggered
 * via {@link triggerReqEvents}, simulating a standard Node.js request stream.
 *
 * @param {object} [options] - Overrides for the mock request properties.
 * @param {string} [options.method] - HTTP method. Defaults to `GET`.
 * @param {string} [options.url] - Request URL. Defaults to `/`.
 * @param {Record<string, string>} [options.headers] - Request headers.
 * @param {string | null} [options.body] - Body string returned on the first `read()` call.
 * @returns {MockRequest} Mock request object with an `EventEmitter` base.
 */
export function createMockReq(options?: {
  method?: string
  url?: string
  headers?: Record<string, string>
  body?: string | null
}): MockRequest {
  const req = Object.assign(new EventEmitter(), {
    method: options?.method || 'GET',
    url: options?.url || '/',
    headers: options?.headers || {},
    _body: options?.body || null,
    _readIndex: 0,

    read() {
      if (this._readIndex === 0 && this._body) {
        this._readIndex++
        return Buffer.from(this._body)
      }
      return null
    },
  }) as unknown as MockRequest

  return req
}

/**
 * Minimal mock response shape used as a type reference.
 */
export type MockResponse = ServerResponse<IncomingMessage> & {
  headers: Record<string, string>
  _capturedData: any
}

/**
 * Full mock response with writable state that can be captured and inspected in tests.
 *
 * Exposes mutable properties for `statusCode`, `headersSent`, `writableEnded`, and
 * captured response data so tests can assert response behavior.
 */
export type MutableMockResponse = EventEmitter &
  Omit<
    MockResponse,
    'headersSent' | 'writableEnded' | 'setHeader' | 'write' | 'end' | 'once' | 'removeListener'
  > & {
    headers: Record<string, string>
    headersSent: boolean
    writableEnded: boolean
    _capturedData: any
    setHeader(key: string, value: string): MutableMockResponse
    write(data: any): boolean
    end(data?: any): MutableMockResponse
    once(event: string, handler: (...args: any[]) => void): MutableMockResponse
    removeListener(event: string, handler: (...args: any[]) => void): MutableMockResponse
  }

/**
 * Create a mock `ServerResponse` compatible with FaasJS server internals.
 *
 * The returned response object tracks headers, captured data, and writable state
 * without relying on an actual socket connection.
 *
 * @param {object} [options] - Mock response options.
 * @param {(data: any) => void} [options.onDataCapture] - Callback invoked when response data is written or ended.
 * @returns {MutableMockResponse} Mock response object that captures writes locally.
 */
export function createMockRes(options?: {
  onDataCapture?: (data: any) => void
}): MutableMockResponse {
  const res = new EventEmitter() as unknown as MutableMockResponse
  res.statusCode = 200
  res.headers = {} as Record<string, string>
  res.writableEnded = false
  res.headersSent = false
  res._capturedData = null

  res.setHeader = function (key: string, value: string) {
    this.headers[key] = value
    return this
  }

  res.write = function (data: any) {
    this._capturedData = data
    this.headersSent = true
    if (options?.onDataCapture) {
      options.onDataCapture(data)
    }
    return true
  }

  res.end = function (data?: any) {
    if (data !== undefined) {
      this._capturedData = data
      this.headersSent = true
      if (options?.onDataCapture) {
        options.onDataCapture(data)
      }
    }
    this.writableEnded = true
    this.headersSent = true
    setImmediate(() => {
      this.emit('finish')
    })
    return this
  }

  res.once = function (event: string, handler: (...args: any[]) => void) {
    return EventEmitter.prototype.once.call(this, event, handler) as MutableMockResponse
  }

  res.getHeaders = function () {
    return { ...this.headers }
  }

  res.removeListener = function (event: string, handler: (...args: any[]) => void) {
    return EventEmitter.prototype.removeListener.call(this, event, handler) as MutableMockResponse
  }

  return res
}

/**
 * Asynchronously emit `readable` and `end` events on a mock request.
 *
 * Fires the events in sequence via `setImmediate` so that event-driven body reading
 * completes before request handling continues.
 *
 * @param {ReturnType<typeof createMockReq>} req - Mock request returned by {@link createMockReq}.
 * @returns {void} No return value.
 */
export function triggerReqEvents(req: ReturnType<typeof createMockReq>) {
  setImmediate(() => {
    req.emit('readable')

    setImmediate(() => {
      req.emit('end')
    })
  })
}
