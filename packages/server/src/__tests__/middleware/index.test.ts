import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { request } from '@faasjs/request'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { Server, closeAll } from '../../server'

describe('server', () => {
  let server: Server
  let cachedServer: Server
  const port = 3001 + Math.floor(Math.random() * 10)
  const cachedPort = port + 1

  beforeAll(() => {
    server = new Server(join(__dirname, 'funcs'), { port, cache: false })
    server.listen()
    cachedServer = new Server(join(__dirname, 'funcs'), {
      port: cachedPort,
      cache: true,
    })
    cachedServer.listen()
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

  it('staticHandler', async () => {
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
  })

  it('staticHandler not found', async () => {
    await expect(request(`http://127.0.0.1:${port}/404`)).rejects.toMatchObject(
      {
        statusCode: 404,
        headers: {},
        body: 'Not Found',
      }
    )
  })

  it('staticHandler custom not found', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/custom404`)
    ).rejects.toMatchObject({
      statusCode: 404,
      headers: {},
      body: 'custom404',
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
