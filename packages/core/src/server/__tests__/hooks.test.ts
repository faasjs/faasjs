import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { Server } from '../../server'
import { createMockReq, createMockRes, triggerReqEvents } from '../mocks'

const apisRoot = join(__dirname, 'apis')

describe('server/hooks', () => {
  const poolId = Number(process.env.VITEST_POOL_ID || 0)

  it('should reject sync lifecycle hooks in constructor', () => {
    expect(
      () =>
        new Server(apisRoot, {
          onStart: (() => {}) as any,
        }),
    ).toThrow('onStart must be async function')

    expect(
      () =>
        new Server(apisRoot, {
          onError: (() => {}) as any,
        }),
    ).toThrow('onError must be async function')

    expect(
      () =>
        new Server(apisRoot, {
          onClose: (() => {}) as any,
        }),
    ).toThrow('onClose must be async function')
  })

  it('should handle onStart', async () => {
    const port = 31301 + poolId
    let times = 0
    const onStart = async () => {
      times++
    }
    const server = new Server(apisRoot, { port, onStart })
    server.listen()

    await new Promise((resolve) => setTimeout(resolve, 100))

    await server.close()

    expect(times).toBe(1)
  })

  it('should handle onError', async () => {
    const port = 31401 + poolId
    let times = 0
    const onError = async () => {
      times++
    }
    const server = new Server(apisRoot, {
      port,
      onError,
      onStart: async () => {
        throw Error('test')
      },
    })
    server.listen()

    await new Promise((resolve) => setTimeout(resolve, 100))

    await server.close()

    expect(times).toBe(1)
  })

  it('should handle SIGTERM and SIGINT with onClose', async () => {
    const port = 31501 + poolId
    let times = 0
    const onClose = async () => {
      times++
    }
    const serverA = new Server(apisRoot, { port, onClose })
    serverA.listen()

    const sigtermHandler = process.listeners('SIGTERM').at(-1) as (() => Promise<void>) | undefined

    await new Promise((resolve) => setTimeout(resolve, 10))
    const resA = fetch(`http://127.0.0.1:${port}/timeout`)
    await new Promise((resolve) => setTimeout(resolve, 10))
    const closeA = sigtermHandler?.()

    const responseA = await resA
    expect(responseA.status).toBe(200)
    expect(await responseA.json()).toEqual({ data: 'done' })

    await closeA
    await new Promise((resolve) => setTimeout(resolve, 100))

    await serverA.close()

    expect(times).toBe(1)

    const serverB = new Server(apisRoot, { port, onClose })
    serverB.listen()

    const sigintHandler = process.listeners('SIGINT').at(-1) as (() => Promise<void>) | undefined

    await new Promise((resolve) => setTimeout(resolve, 10))

    const resB = fetch(`http://127.0.0.1:${port}/timeout`)
    await new Promise((resolve) => setTimeout(resolve, 10))
    const closeB = sigintHandler?.()

    const responseB = await resB
    expect(responseB.status).toBe(200)
    expect(await responseB.json()).toEqual({ data: 'done' })

    await closeB
    await new Promise((resolve) => setTimeout(resolve, 100))

    await serverB.close()

    expect(times).toBe(2)
  })

  it('should forward uncaught handlers to onError', async () => {
    const port = 31701 + poolId
    const errors: string[] = []

    const server = new Server(apisRoot, {
      port,
      onError: async (error) => {
        errors.push(error.message)
      },
    })

    server.listen()

    const uncaughtHandler = process.listeners('uncaughtException').at(-1) as
      | ((error: unknown) => void)
      | undefined
    const rejectionHandler = process.listeners('unhandledRejection').at(-1) as
      | ((reason: unknown, promise: Promise<unknown>) => void)
      | undefined

    uncaughtHandler?.(Error('uncaught-test'))
    rejectionHandler?.(Error('rejection-test'), Promise.resolve())

    await new Promise((resolve) => setTimeout(resolve, 50))

    await server.close()

    expect(errors).toContain('uncaught-test')
    expect(errors).toContain('rejection-test')
  })

  it('should call onError when socket destroy and onClose fail', async () => {
    const port = 31801 + poolId
    const errors: string[] = []

    const server = new Server(apisRoot, {
      port,
      onError: async (error) => {
        errors.push(error.message)
      },
      onClose: async () => {
        throw Error('on-close failed')
      },
    })

    server.listen()
    ;(server as any).sockets.add({
      destroy() {
        throw Error('socket-destroy failed')
      },
    })

    await server.close()

    expect(errors).toContain('socket-destroy failed')
    expect(errors).toContain('on-close failed')
  })

  it('should handle beforeHandle', async () => {
    const port = 31601 + poolId
    let times = 0
    let receivedRoot = ''
    let receivedLogger = false
    const serverRoot = apisRoot
    const beforeHandle = async (
      _: unknown,
      __: unknown,
      context: { root: string; logger?: unknown },
    ) => {
      times++
      receivedRoot = context.root
      receivedLogger = typeof context.logger !== 'undefined'
    }
    const server = new Server(serverRoot, { port, beforeHandle })
    server.listen()

    const req = createMockReq({
      method: 'GET',
      url: '/hello',
      headers: {},
      body: null,
    })

    const res = createMockRes()

    triggerReqEvents(req)

    await server.middleware(req as any, res as any, () => {})

    expect(times).toBe(1)
    expect(receivedRoot).toBe(server.root)
    expect(receivedLogger).toBe(true)
  })

  it('should respond 500 when beforeHandle throws', async () => {
    const server = new Server(apisRoot, {
      beforeHandle: async () => {
        throw Error('before-handle failed')
      },
    })

    let responseData: string | null = null
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

    expect(res.statusCode).toBe(500)
    expect(responseData).toBe('Internal Server Error')
    expect(nextCalled).toBe(false)
  })

  it('should stop handler execution when beforeHandle already ends response', async () => {
    const server = new Server(apisRoot, {
      beforeHandle: async (_, res) => {
        res.statusCode = 202
        res.end('before-handle')
      },
    })

    let responseData: string | null = null
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

    expect(res.statusCode).toBe(202)
    expect(responseData).toBe('before-handle')
    expect(nextCalled).toBe(false)
  })
})
