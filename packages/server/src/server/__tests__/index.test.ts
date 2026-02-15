import { join, sep } from 'node:path'
import { request } from '@faasjs/request'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { closeAll, getAll, Server } from '../../server'

describe.sequential('server', () => {
  let server: Server
  const poolId = Number(process.env.VITEST_POOL_ID || 0)
  const port = 31201 + poolId

  beforeAll(() => {
    server = new Server(join(__dirname, 'funcs'), {
      port,
    })
    server.listen()
  })

  afterAll(async () => {
    await closeAll()
  })

  it('check config', async () => {
    expect(getAll()).toHaveLength(1)
    expect(getAll()[0].root).toEqual(join(__dirname, 'funcs', sep))
    expect(getAll()[0].options).toEqual({
      port,
    })
  })

  it('404', async () => {
    await expect(request(`http://127.0.0.1:${port}/404`)).rejects.toMatchObject(
      {
        statusCode: 404,
        body: {
          error: {
            message: `Not found function file.\nSearch paths:\n- ${server.root}404.func.ts\n- ${server.root}404/index.func.ts\n- ${server.root}404/default.func.ts\n- ${server.root}default.func.ts`,
          },
        },
      }
    )
  })

  it('hello', async () => {
    const result = await request(`http://127.0.0.1:${port}/hello`, {
      headers: { 'x-faasjs-request-id': 'test' },
    })
    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({ data: 'hello' })
    expect(result.headers['x-faasjs-request-id']).toBe('test')
    expect(result.headers['x-headers']).toBe('x-x')
    expect(result.headers['access-control-expose-headers']).toContain(
      'content-type'
    )
    expect(result.headers['access-control-expose-headers']).toContain(
      'authorization'
    )
    expect(result.headers['access-control-expose-headers']).toContain(
      'x-faasjs-request-id'
    )
    expect(result.headers['access-control-expose-headers']).toContain(
      'x-faasjs-timing-pending'
    )
    expect(result.headers['access-control-expose-headers']).toContain(
      'x-faasjs-timing-processing'
    )
    expect(result.headers['access-control-expose-headers']).toContain(
      'x-faasjs-timing-total'
    )
    expect(result.headers['access-control-expose-headers']).toContain(
      'accept-encoding'
    )
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
      body: 'Internal Server Error',
    })
  })

  it('business 500', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/business-500`)
    ).rejects.toMatchObject({
      statusCode: 500,
      body: { error: { message: 'business-500' } },
    })
  })

  it('business 500 return', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/business-500-return`)
    ).rejects.toMatchObject({
      statusCode: 500,
      body: { error: { message: 'business-500-return' } },
    })
  })

  it('OPTIONS', async () => {
    const result = await request(`http://127.0.0.1:${port}`, {
      method: 'OPTIONS',
      headers: {
        'X-X': 'test',
        'Content-Type': 'text/html',
        'access-control-request-headers': 'x-y',
      },
    })
    expect(result.statusCode).toBe(204)
    expect(result.headers['access-control-allow-credentials']).toBe('true')
    expect(result.headers['access-control-allow-headers']).toContain(
      'content-type'
    )
    expect(result.headers['access-control-allow-headers']).toContain(
      'authorization'
    )
    expect(result.headers['access-control-allow-headers']).toContain(
      'x-faasjs-request-id'
    )
    expect(result.headers['access-control-allow-headers']).toContain(
      'x-faasjs-timing-pending'
    )
    expect(result.headers['access-control-allow-headers']).toContain(
      'x-faasjs-timing-processing'
    )
    expect(result.headers['access-control-allow-headers']).toContain(
      'x-faasjs-timing-total'
    )
    expect(result.headers['access-control-allow-headers']).toContain('x-x')
    expect(result.headers['access-control-allow-headers']).toContain(
      'accept-encoding'
    )
    expect(result.headers['access-control-allow-headers']).toContain('x-y')
    expect(result.headers['access-control-allow-methods']).toBe('OPTIONS, POST')
    expect(result.headers['access-control-allow-origin']).toBe('*')
  })

  it('runtime', async () => {
    await expect(
      request(`http://127.0.0.1:${port}/runtime`)
    ).resolves.toMatchObject({
      statusCode: 200,
      body: {
        data: 'module',
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

  it('POST with body', async () => {
    const testBody = { message: 'test', value: 123 }
    const result = await request(`http://127.0.0.1:${port}/post-body`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-faasjs-request-id': 'test',
      },
      body: testBody,
    })

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: {
        receivedBody: testBody,
        method: 'POST',
      },
    })
    expect(result.headers['x-faasjs-request-id']).toBe('test')
  })

  it('no return (204)', async () => {
    const result = await request(`http://127.0.0.1:${port}/no-return`)
    expect(result.statusCode).toBe(204)
    expect(result.body).toEqual('')
    expect(result.headers['x-faasjs-request-id']).toBeDefined()
  })
})
