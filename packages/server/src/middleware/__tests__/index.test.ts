import { join } from 'node:path'
import { request } from '@faasjs/request'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { Server, closeAll } from '../../server'

describe('middleware', () => {
  let server: Server
  const port = 3001 + Number(process.env.VITEST_POOL_ID)

  beforeAll(() => {
    server = new Server(join(__dirname, 'funcs'), { port })
    server.listen()
  })

  afterAll(async () => {
    await closeAll()
  })

  it('useMiddleware', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/useMiddleware`)
    ).resolves.toMatchObject({
      statusCode: 200,
      headers: {},
      body: 'useMiddleware',
    })
  })

  it('emptyMiddleware', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/emptyUseMiddleware`)
    ).rejects.toMatchObject({
      statusCode: 404,
      headers: {},
      body: 'Not Found',
    })
  })

  it('useMiddlewares', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/useMiddlewares`)
    ).resolves.toMatchObject({
      statusCode: 200,
      headers: {},
      body: 'useMiddlewares',
    })
  })

  it('emptyMiddlewares', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/emptyUseMiddlewares`)
    ).rejects.toMatchObject({
      statusCode: 404,
      headers: {},
      body: 'Not Found',
    })
  })

  it('middleware error', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/error`)
    ).rejects.toMatchObject({
      statusCode: 500,
      headers: {},
      body: 'Error: useMiddleware',
    })
  })
})
