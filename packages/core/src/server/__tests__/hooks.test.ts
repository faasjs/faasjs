import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { Server } from '../../server'
import { createMockReq, createMockRes, triggerReqEvents } from './mocks'

describe('server/hooks', () => {
  const poolId = Number(process.env.VITEST_POOL_ID || 0)

  it('should handle onStart', async () => {
    const port = 31301 + poolId
    let times = 0
    const onStart = async () => {
      times++
    }
    const server = new Server(join(__dirname, 'funcs'), { port, onStart })
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
    const server = new Server(join(__dirname, 'funcs'), {
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
    const serverA = new Server(join(__dirname, 'funcs'), { port, onClose })
    serverA.listen()

    await new Promise((resolve) => setTimeout(resolve, 10))
    const resA = fetch(`http://127.0.0.1:${port}/timeout`)
    await new Promise((resolve) => setTimeout(resolve, 10))
    process.emit('SIGTERM')

    const responseA = await resA
    expect(responseA.status).toBe(200)
    expect(await responseA.json()).toEqual({ data: 'done' })

    await new Promise((resolve) => setTimeout(resolve, 100))

    await serverA.close()

    expect(times).toBe(1)

    const serverB = new Server(join(__dirname, 'funcs'), { port, onClose })
    serverB.listen()

    await new Promise((resolve) => setTimeout(resolve, 10))

    const resB = fetch(`http://127.0.0.1:${port}/timeout`)
    await new Promise((resolve) => setTimeout(resolve, 10))
    process.emit('SIGINT')

    const responseB = await resB
    expect(responseB.status).toBe(200)
    expect(await responseB.json()).toEqual({ data: 'done' })

    await new Promise((resolve) => setTimeout(resolve, 100))

    await serverB.close()

    expect(times).toBe(2)
  })

  it('should handle beforeHandle', async () => {
    const port = 31601 + poolId
    let times = 0
    const beforeHandle = async () => {
      times++
    }
    const server = new Server(join(__dirname, 'funcs'), { port, beforeHandle })
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
  })
})
