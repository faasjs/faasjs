import { join, sep } from 'node:path'
import { request } from '@faasjs/request'
import { Server, closeAll } from '../../server'

describe('server', () => {
  let server: Server
  let cachedServer: Server
  const port = 3001 + Number(process.env.VITEST_POOL_ID)
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

  it('check config', async () => {
    expect(server.root).toEqual(join(__dirname, 'funcs', sep))
    expect(server.opts).toEqual({
      cache: false,
      port,
    })
    expect(cachedServer.root).toEqual(join(__dirname, 'funcs', sep))
    expect(cachedServer.opts).toEqual({
      cache: true,
      port: cachedPort,
    })
  })

  it('404', async () => {
    await expect(request(`http://127.0.0.1:${port}/404`)).rejects.toMatchObject(
      {
        statusCode: 404,
        body: {
          error: {
            message: `Not found function file.\nSearch paths:\n- ${server.root}404.func.ts\n- ${server.root}404.func.tsx\n- ${server.root}404/index.func.ts\n- ${server.root}404/index.func.tsx\n- ${server.root}default.func.ts\n- ${server.root}default.func.tsx`,
          },
        },
      }
    )
    await expect(
      request(`http://127.0.0.1:${cachedPort}/404`)
    ).rejects.toMatchObject({
      statusCode: 404,
      body: {
        error: {
          message: `Not found function file.\nSearch paths:\n- ${server.root}404.func.ts\n- ${server.root}404.func.tsx\n- ${server.root}404/index.func.ts\n- ${server.root}404/index.func.tsx\n- ${server.root}default.func.ts\n- ${server.root}default.func.tsx`,
        },
      },
    })
  })

  it('hello', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/hello`, {
        headers: { 'x-faasjs-request-id': 'test' },
      })
    ).resolves.toMatchObject({
      headers: {
        'x-faasjs-request-id': 'test',
        'x-headers': 'x-x',
        'access-control-expose-headers':
          'content-type,authorization,x-faasjs-request-id,x-faasjs-timing-pending,x-faasjs-timing-processing,x-faasjs-timing-total',
      },
      statusCode: 200,
      body: { data: 'hello' },
    })

    await expect(
      request(`http://127.0.0.1:${cachedPort}/hello`, {
        headers: { 'x-faasjs-request-id': 'test' },
      })
    ).resolves.toMatchObject({
      headers: {
        'x-faasjs-request-id': 'test',
        'x-headers': 'x-x',
        'access-control-expose-headers':
          'content-type,authorization,x-faasjs-request-id,x-faasjs-timing-pending,x-faasjs-timing-processing,x-faasjs-timing-total',
      },
      statusCode: 200,
      body: { data: 'hello' },
    })

    await expect(
      request(`http://127.0.0.1:${cachedPort}/hello`, {
        headers: { 'x-faasjs-request-id': 'test' },
      })
    ).resolves.toMatchObject({
      headers: {
        'x-faasjs-request-id': 'test',
        'x-headers': 'x-x',
        'access-control-expose-headers':
          'content-type,authorization,x-faasjs-request-id,x-faasjs-timing-pending,x-faasjs-timing-processing,x-faasjs-timing-total',
      },
      statusCode: 200,
      body: { data: 'hello' },
    })
  })

  it('tsx', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/tsx`)
    ).resolves.toMatchObject({
      statusCode: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
      body: '<h1>Hi</h1>',
    })
  })

  it('a', async () => {
    await expect(request(`http://127.0.0.1:${port}/a`)).resolves.toMatchObject({
      statusCode: 200,
      body: { data: 'a' },
    })
  })

  it('a/default', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/a/a`)
    ).resolves.toMatchObject({
      statusCode: 200,
      body: { data: 'default' },
    })
  })

  it('deep default', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/a/a/a/a/a`)
    ).resolves.toMatchObject({
      statusCode: 200,
      body: { data: 'default' },
    })
  })

  it('query', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/query?key=value`)
    ).resolves.toMatchObject({
      statusCode: 200,
      body: { data: { key: 'value' } },
    })
  })

  it('500', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/error`)
    ).rejects.toMatchObject({
      statusCode: 500,
      body: { error: { message: 'error' } },
    })
  })

  it('OPTIONS', async () => {
    await expect(
      request(`http://127.0.0.1:${port}`, {
        method: 'OPTIONS',
        headers: {
          'X-X': 'test',
          'Content-Type': 'text/html',
          'access-control-request-headers': 'x-y',
        },
      })
    ).resolves.toMatchObject({
      statusCode: 204,
      headers: {
        'access-control-allow-credentials': 'true',
        'access-control-allow-headers':
          'x-x, accept-encoding, x-y, content-type, authorization, x-faasjs-request-id, x-faasjs-timing-pending, x-faasjs-timing-processing, x-faasjs-timing-total',
        'access-control-allow-methods': 'OPTIONS, POST',
        'access-control-allow-origin': '*',
      },
    })
  })

  describe('compress', () => {
    it('br', async () => {
      const response = await fetch(`http://127.0.0.1:${port}/compress`, {
        headers: { 'Accept-Encoding': 'br' },
      })

      expect(response.status).toEqual(200)
      expect(response.headers.get('content-encoding')).toEqual('br')
      expect(await response.text()).toContain('hello')
    })

    it('gzip', async () => {
      const response = await fetch(`http://127.0.0.1:${port}/compress`, {
        headers: { 'Accept-Encoding': 'gzip' },
      })

      expect(response.status).toEqual(200)
      expect(response.headers.get('content-encoding')).toEqual('gzip')
      expect(await response.text()).toContain('hello')
    })

    it('deflate', async () => {
      const response = await fetch(`http://127.0.0.1:${port}/compress`, {
        headers: { 'Accept-Encoding': 'deflate' },
      })

      expect(response.status).toEqual(200)
      expect(response.headers.get('content-encoding')).toEqual('deflate')
      expect(await response.text()).toContain('hello')
    })

    it('unknown', async () => {
      const response = await fetch(`http://127.0.0.1:${port}/compress`, {
        headers: { 'Accept-Encoding': 'unknown' },
      })

      expect(response.status).toEqual(200)
      expect(response.headers.get('content-encoding')).toBeNull()
      expect(await response.text()).toContain('hello')
    })
  })

  it('raw', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/raw`)
    ).resolves.toMatchObject({
      statusCode: 200,
      body: 'hello',
    })
  })

  it('Response', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/response`)
    ).resolves.toMatchObject({
      statusCode: 200,
      body: 'hello',
    })
  })

  it('stream', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/stream`)
    ).resolves.toMatchObject({
      statusCode: 200,
      body: 'hello world',
    })
  })

  it('stream error', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/stream-error`)
    ).resolves.toMatchObject({
      statusCode: 200,
      body: 'hello',
    })
  })

  it('multi process', async () => {
    const results = await Promise.all([
      request(`http://127.0.0.1:${port}/stream`, {
        headers: { 'x-faasjs-request-id': 'test' },
      }),
      request(`http://127.0.0.1:${port}/stream`, {
        headers: { 'x-faasjs-request-id': 'test' },
      }),
    ])

    expect(results).toHaveLength(2)

    expect(results[0]).toMatchObject({
      statusCode: 200,
      body: 'hello world',
    })
  })
})
