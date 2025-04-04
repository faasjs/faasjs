import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { Server } from '../../server'

describe('middleware', () => {
  it('should work', async () => {
    const server = new Server(join(__dirname, 'funcs'))

    let responseData: any = null

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
        write: (data: any) => {
          responseData = data
          return this
        },
        end: () => {
          return this
        },
      } as any,
      () => {}
    )

    expect(responseData).toEqual(JSON.stringify({ data: 'hello' }))
  })

  it('should not work if not found function', async () => {
    const server = new Server(join(__dirname, 'funcs'))

    let responseData: any = null

    await server.middleware(
      {
        method: 'GET',
        url: '/404',
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
        write: (data: any) => {
          responseData = data
          return this
        },
        end: () => {
          return this
        },
      } as any,
      () => {}
    )

    expect(responseData).toBeNull()
  })

  it('should handle option method', async () => {
    const server = new Server(join(__dirname, 'funcs'))

    let statusCode = 200
    let writableEnded = false

    await server.middleware(
      {
        method: 'OPTIONS',
        url: '/hello',
        headers: {},
        body: null,
        on: (type: string, handler: () => void) => {
          if (type === 'end') handler()
        },
      } as any,
      {
        statusCode,
        headers: {},
        writableEnded,
        writeHead: (code: number) => {
          statusCode = code
          return this
        },
        end: () => {
          writableEnded = true
          return this
        },
      } as any,
      () => {}
    )

    expect(statusCode).toBe(204)
    expect(writableEnded).toBe(true)
  })
})
