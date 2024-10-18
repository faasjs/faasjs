import { closeAll, Server } from '..'
import { request } from '@faasjs/request'
import { join, sep } from 'node:path'

describe('server', () => {
  let server: Server
  let port: number

  beforeAll(() => {
    port = 3001 + Math.floor(Math.random() * 10)
    server = new Server(join(__dirname, 'funcs'), { port })
    server.listen()
  })

  afterAll(async () => {
    await closeAll()
  })

  test('check config', async () => {
    expect(server.root).toEqual(join(__dirname, 'funcs', sep))
    expect(server.opts).toEqual({
      cache: false,
      port,
    })
  })

  test('404', async () => {
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
  })

  test('hello', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/hello`, {
        headers: { 'x-faasjs-request-id': 'test' },
      })
    ).resolves.toMatchObject({
      headers: {
        'x-faasjs-request-id': 'test',
        'access-control-expose-headers':
          'x-x,content-type,authorization,x-faasjs-request-id,x-faasjs-timing-pending,x-faasjs-timing-processing,x-faasjs-timing-total',
      },
      statusCode: 200,
      body: { data: 'hello' },
    })
  })

  test('tsx', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/tsx`)
    ).resolves.toMatchObject({
      statusCode: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
      body: '<h1>Hi</h1>',
    })
  })

  test('a', async () => {
    await expect(request(`http://127.0.0.1:${port}/a`)).resolves.toMatchObject({
      statusCode: 200,
      body: { data: 'a' },
    })
  })

  test('a/default', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/a/a`)
    ).resolves.toMatchObject({
      statusCode: 200,
      body: { data: 'default' },
    })
  })

  test('deep default', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/a/a/a/a/a`)
    ).resolves.toMatchObject({
      statusCode: 200,
      body: { data: 'default' },
    })
  })

  test('query', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/query?key=value`)
    ).resolves.toMatchObject({
      statusCode: 200,
      body: { data: { key: 'value' } },
    })
  })

  test('500', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/error`)
    ).rejects.toMatchObject({
      statusCode: 500,
      body: { error: { message: 'error' } },
    })
  })

  test('OPTIONS', async () => {
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
})
