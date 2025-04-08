import { join } from 'node:path'
import { request } from '@faasjs/request'
import { describe, expect, it } from 'vitest'
import { Server } from '../../server'

describe('server/hooks', () => {
  it('should handle onStart', async () => {
    const port = 3002 + Number(process.env.VITEST_POOL_ID)
    let times = 0
    const onStart = async () => {
      times++
    }
    const server = new Server(join(__dirname, 'funcs'), { port, onStart })
    server.listen()

    await new Promise(resolve => setTimeout(resolve, 100))

    await server.close()

    expect(times).toBe(1)
  })

  it('should handle onError', async () => {
    const port = 3004 + Number(process.env.VITEST_POOL_ID)
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

    await new Promise(resolve => setTimeout(resolve, 100))

    await server.close()

    expect(times).toBe(1)
  })

  it('should handle SIGTERM and SIGINT with onClose', async () => {
    const port = 3005 + Number(process.env.VITEST_POOL_ID)
    let times = 0
    const onClose = async () => {
      times++
    }
    const serverA = new Server(join(__dirname, 'funcs'), { port, onClose })
    serverA.listen()

    await new Promise(resolve => setTimeout(resolve, 10))
    const resA = request(`http://127.0.0.1:${port}/timeout`)
    await new Promise(resolve => setTimeout(resolve, 10))
    process.emit('SIGTERM')

    expect(await resA).toMatchObject({
      statusCode: 200,
      body: { data: 'done' },
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    await serverA.close()

    expect(times).toBe(1)

    const serverB = new Server(join(__dirname, 'funcs'), { port, onClose })
    serverB.listen()

    await new Promise(resolve => setTimeout(resolve, 10))

    const resB = request(`http://127.0.0.1:${port}/timeout`)
    await new Promise(resolve => setTimeout(resolve, 10))
    process.emit('SIGINT')

    await expect(resB).resolves.toMatchObject({
      statusCode: 200,
      body: { data: 'done' },
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    await serverB.close()

    expect(times).toBe(2)
  })

  it('should handle beforeHandle', async () => {
    const port = 3006 + Number(process.env.VITEST_POOL_ID)
    let times = 0
    const beforeHandle = async () => {
      times++
    }
    const server = new Server(join(__dirname, 'funcs'), { port, beforeHandle })
    server.listen()

    await server.middleware(
      {
        method: 'GET',
        url: '/hello',
        headers: {},
        body: null,
        on: (type: string, handler: () => void) => {
          if (type === 'end') handler()
        },
      } as any,
      {
        statusCode: 200,
        headers: {},
        writableEnded: false,
        setHeader: () => {
          return this
        },
        write: () => {
          return this
        },
        end: () => {
          return this
        },
      } as any,
      () => { }
    )

    expect(times).toBe(1)
  })
})
