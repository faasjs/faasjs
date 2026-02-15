import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { request } from '@faasjs/request'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { closeAll, Server } from '../../server'

describe('staticHandler', () => {
  let server: Server
  const poolId = Number(process.env.VITEST_POOL_ID || 0)
  const port = 31101 + poolId

  beforeAll(() => {
    server = new Server(join(__dirname, 'funcs'), { port })
    server.listen()
  })

  afterAll(async () => {
    await closeAll()
  })

  it('should work', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/useMiddleware.func.ts`)
    ).resolves.toMatchObject({
      statusCode: 200,
      headers: {},
      body: readFileSync(
        join(__dirname, 'funcs', 'useMiddleware.func.ts'),
        'utf-8'
      ),
    })
    await expect(
      request(`http://127.0.0.1:${port}/useMiddleware.func.ts`)
    ).resolves.toMatchObject({
      statusCode: 200,
      headers: {},
      body: readFileSync(
        join(__dirname, 'funcs', 'useMiddleware.func.ts'),
        'utf-8'
      ),
    })
    await expect(
      request(`http://127.0.0.1:${port}/default.default.func.ts`)
    ).resolves.toMatchObject({
      statusCode: 200,
      headers: {},
      body: readFileSync(join(__dirname, 'funcs', 'default.func.ts'), 'utf-8'),
    })
  })

  it('notFound', async () => {
    await expect(request(`http://127.0.0.1:${port}/404`)).rejects.toMatchObject(
      {
        statusCode: 404,
        headers: {},
        body: 'Not Found',
      }
    )
    await expect(request(`http://127.0.0.1:${port}/404`)).rejects.toMatchObject(
      {
        statusCode: 404,
        headers: {},
        body: 'Not Found',
      }
    )
  })

  it('notFound with fallback path', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/fallback404`)
    ).resolves.toMatchObject({
      statusCode: 200,
      headers: {},
      body: readFileSync(
        join(__dirname, 'funcs', 'useMiddleware.func.ts'),
        'utf-8'
      ),
    })
  })

  it('notFound with handle function', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/custom404`)
    ).rejects.toMatchObject({
      statusCode: 404,
      headers: {},
      body: 'custom404',
    })
    await expect(
      request(`http://127.0.0.1:${port}/custom404`)
    ).rejects.toMatchObject({
      statusCode: 404,
      headers: {},
      body: 'custom404',
    })
  })
})
