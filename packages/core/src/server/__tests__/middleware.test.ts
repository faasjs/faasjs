import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { Server } from '../../server'
import { createMockReq, createMockRes, triggerReqEvents } from '../mocks'

const apisRoot = join(__dirname, 'apis')

describe('middleware', () => {
  it('should work', async () => {
    const server = new Server(apisRoot)

    let responseData: any = null
    let nextCalled = false

    const req = createMockReq({
      method: 'GET',
      url: '/hello',
      headers: {},
      body: null,
    })

    const res = createMockRes({
      onDataCapture: (data: any) => {
        responseData = Buffer.isBuffer(data) ? data.toString() : data
      },
    })

    triggerReqEvents(req)

    await server.middleware(req as any, res as any, () => {
      nextCalled = true
    })

    expect(responseData).toEqual(JSON.stringify({ data: 'hello' }))
    expect(nextCalled).toBe(false)
  })

  it('should not work if the API file is not found', async () => {
    const server = new Server(apisRoot)

    let responseData: any = null
    let nextCalled = false

    const req = createMockReq({
      method: 'GET',
      url: '/404',
      headers: {},
      body: null,
    })

    const res = createMockRes({
      onDataCapture: (data: any) => {
        responseData = Buffer.isBuffer(data) ? data.toString() : data
      },
    })

    triggerReqEvents(req)

    await server.middleware(req as any, res as any, () => {
      nextCalled = true
    })

    expect(responseData).toBeNull()
    expect(nextCalled).toBe(true)
  })

  it('should block traversal attempts outside the server root', async () => {
    const server = new Server(apisRoot)

    let responseData: any = null
    let nextCalled = false

    const req = createMockReq({
      method: 'GET',
      url: '/../escaped',
      headers: {},
      body: null,
    })

    const res = createMockRes({
      onDataCapture: (data: any) => {
        responseData = Buffer.isBuffer(data) ? data.toString() : data
      },
    })

    triggerReqEvents(req)

    await server.middleware(req as any, res as any, () => {
      nextCalled = true
    })

    expect(responseData).toBeNull()
    expect(nextCalled).toBe(true)
  })

  it('should handle option method', async () => {
    const server = new Server(apisRoot)
    let nextCalled = false

    const req = createMockReq({
      method: 'OPTIONS',
      url: '/hello',
      headers: {},
      body: null,
    })

    const res = createMockRes()

    const mockWriteHead = function (this: typeof res, code: number) {
      res.statusCode = code
      return this
    }
    Object.assign(res, { writeHead: mockWriteHead })

    triggerReqEvents(req)

    await server.middleware(req as any, res as any, () => {
      nextCalled = true
    })

    expect(res.statusCode).toBe(204)
    expect(res.writableEnded).toBe(true)
    expect(nextCalled).toBe(false)
  })

  it('should respond 400 if url is missing', async () => {
    const server = new Server(apisRoot)

    let responseData: any = null
    let nextCalled = false

    const req = createMockReq({
      method: 'GET',
      url: '/hello',
      headers: {},
      body: null,
    })
    req.url = undefined as any

    const res = createMockRes({
      onDataCapture: (data: any) => {
        responseData = Buffer.isBuffer(data) ? data.toString() : data
      },
    })

    await server.middleware(req as any, res as any, () => {
      nextCalled = true
    })

    expect(res.statusCode).toBe(400)
    expect(responseData).toBe('Bad Request: url is undefined')
    expect(nextCalled).toBe(false)
  })
})
