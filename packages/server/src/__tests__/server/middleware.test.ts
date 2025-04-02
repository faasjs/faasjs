import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { Server } from '../../server'

describe('middleware', () => {
  it('test', async () => {
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
})
