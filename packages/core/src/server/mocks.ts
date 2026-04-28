import { EventEmitter } from 'node:events'
import type { IncomingMessage, ServerResponse } from 'node:http'

export type MockRequest = EventEmitter &
  IncomingMessage & {
    _body: string | null
    _readIndex: number
    read(): Buffer | null
  }

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

export type MockResponse = ServerResponse<IncomingMessage> & {
  headers: Record<string, string>
  _capturedData: any
}

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

  res.removeListener = function (event: string, handler: (...args: any[]) => void) {
    return EventEmitter.prototype.removeListener.call(this, event, handler) as MutableMockResponse
  }

  return res
}

export function triggerReqEvents(req: ReturnType<typeof createMockReq>) {
  setImmediate(() => {
    req.emit('readable')

    setImmediate(() => {
      req.emit('end')
    })
  })
}
