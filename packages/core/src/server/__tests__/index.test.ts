import { join, sep } from 'node:path'
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
    const response = await fetch(`http://127.0.0.1:${port}/404`)
    expect(response.status).toBe(404)
    expect(await response.json()).toMatchObject({
      error: {
        message: `Not found function file.\nSearch paths:\n- ${server.root}404.func.ts\n- ${server.root}404/index.func.ts\n- ${server.root}404/default.func.ts\n- ${server.root}default.func.ts`,
      },
    })
  })

  it('hello', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/hello`, {
      headers: { 'x-faasjs-request-id': 'test' },
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({ data: 'hello' })
    expect(response.headers.get('x-faasjs-request-id')).toBe('test')
    expect(response.headers.get('x-headers')).toBe('x-x')

    const exposeHeaders = response.headers.get('access-control-expose-headers') || ''
    expect(exposeHeaders).toContain('content-type')
    expect(exposeHeaders).toContain('authorization')
    expect(exposeHeaders).toContain('x-faasjs-request-id')
    expect(exposeHeaders).toContain('x-faasjs-timing-pending')
    expect(exposeHeaders).toContain('x-faasjs-timing-processing')
    expect(exposeHeaders).toContain('x-faasjs-timing-total')
    expect(exposeHeaders).toContain('accept-encoding')
  })

  it('a', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/a`)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ data: 'a' })
  })

  it('a/default', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/a/a`)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ data: 'default' })
  })

  it('deep default', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/a/a/a/a/a`)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ data: 'default' })
  })

  it('query', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/query?key=value`)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ data: { key: 'value' } })
  })

  it('500', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/error`)
    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Internal Server Error')
  })

  it('business 500', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/business-500`)
    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: { message: 'business-500' } })
  })

  it('business 500 return', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/business-500-return`)
    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: { message: 'business-500-return' } })
  })

  it('OPTIONS', async () => {
    const response = await fetch(`http://127.0.0.1:${port}`, {
      method: 'OPTIONS',
      headers: {
        'X-X': 'test',
        'Content-Type': 'text/html',
        'access-control-request-headers': 'x-y',
      },
    })

    expect(response.status).toBe(204)
    expect(response.headers.get('access-control-allow-credentials')).toBe('true')

    const allowHeaders = response.headers.get('access-control-allow-headers') || ''
    expect(allowHeaders).toContain('content-type')
    expect(allowHeaders).toContain('authorization')
    expect(allowHeaders).toContain('x-faasjs-request-id')
    expect(allowHeaders).toContain('x-faasjs-timing-pending')
    expect(allowHeaders).toContain('x-faasjs-timing-processing')
    expect(allowHeaders).toContain('x-faasjs-timing-total')
    expect(allowHeaders).toContain('x-x')
    expect(allowHeaders).toContain('accept-encoding')
    expect(allowHeaders).toContain('x-y')
    expect(response.headers.get('access-control-allow-methods')).toBe('OPTIONS, POST')
    expect(response.headers.get('access-control-allow-origin')).toBe('*')
  })

  it('runtime', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/runtime`)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      data: 'module',
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
    const response = await fetch(`http://127.0.0.1:${port}/raw`)
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('hello')
  })

  it('Response', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/response`)
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('hello')
  })

  it('stream', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/stream`)
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('hello world')
  })

  it('stream error', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/stream-error`)
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('hello')
  })

  it('multi process', async () => {
    const responses = await Promise.all([
      fetch(`http://127.0.0.1:${port}/stream`, {
        headers: { 'x-faasjs-request-id': 'test' },
      }),
      fetch(`http://127.0.0.1:${port}/stream`, {
        headers: { 'x-faasjs-request-id': 'test' },
      }),
    ])

    expect(responses).toHaveLength(2)

    expect(responses[0].status).toBe(200)
    expect(await responses[0].text()).toBe('hello world')

    expect(responses[1].status).toBe(200)
    expect(await responses[1].text()).toBe('hello world')
  })

  it('POST with body', async () => {
    const testBody = { message: 'test', value: 123 }
    const response = await fetch(`http://127.0.0.1:${port}/post-body`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-faasjs-request-id': 'test',
      },
      body: JSON.stringify(testBody),
    })

    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      data: {
        receivedBody: testBody,
        method: 'POST',
      },
    })
    expect(response.headers.get('x-faasjs-request-id')).toBe('test')
  })

  it('no return (204)', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/no-return`)
    expect(response.status).toBe(204)
    expect(await response.text()).toBe('')
    expect(response.headers.get('x-faasjs-request-id')).not.toBeNull()
  })
})
