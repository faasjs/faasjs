import { EventEmitter } from 'node:events'

export function createMockReq(options?: {
  method?: string
  url?: string
  headers?: Record<string, string>
  body?: string | null
}) {
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
  })

  return req
}

export function createMockRes(options?: { onDataCapture?: (data: any) => void }) {
  const res = new EventEmitter() as any
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
    return this
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
    return EventEmitter.prototype.once.call(this, event, handler)
  }

  res.removeListener = function (event: string, handler: (...args: any[]) => void) {
    return EventEmitter.prototype.removeListener.call(this, event, handler)
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
