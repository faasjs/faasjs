import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { Server } from '../../server'
import { createMockReq, createMockRes, triggerReqEvents } from './mocks'

describe('middleware', () => {
  it('should work', async () => {
    const server = new Server(join(__dirname, 'funcs'))

    let responseData: any = null

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

    await server.middleware(req as any, res as any, () => {})

    expect(responseData).toEqual(JSON.stringify({ data: 'hello' }))
  })

  it('should not work if not found function', async () => {
    const server = new Server(join(__dirname, 'funcs'))

    let responseData: any = null

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

    await server.middleware(req as any, res as any, () => {})

    expect(responseData).toBeNull()
  })

  it('should handle option method', async () => {
    const server = new Server(join(__dirname, 'funcs'))

    const req = createMockReq({
      method: 'OPTIONS',
      url: '/hello',
      headers: {},
      body: null,
    })

    const res = createMockRes()

    const mockWriteHead = function(this: typeof res, code: number) {
      res.statusCode = code
      return this
    }
    Object.assign(res, { writeHead: mockWriteHead })

    triggerReqEvents(req)

    await server.middleware(req as any, res as any, () => {})

    expect(res.statusCode).toBe(204)
    expect(res.writableEnded).toBe(true)
  })
})
