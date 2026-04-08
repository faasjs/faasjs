import { streamToString } from '@faasjs/utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Http } from '..'

function createLogger() {
  return {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    trace: vi.fn(),
    warn: vi.fn(),
  }
}

function createInvokeData(overrides: Record<string, any> = {}) {
  return {
    event: {
      headers: {},
      body: null,
      queryString: Object.create(null),
      ...overrides.event,
    },
    context: {
      request_id: 'request-id',
      ...overrides.context,
    },
    logger: overrides.logger || createLogger(),
    config: overrides.config || Object.create(null),
    response: overrides.response,
    ...overrides,
  }
}

describe('http/coverage', () => {
  const originalReadableStream = globalThis.ReadableStream
  const originalSecretMethod = process.env.SECRET_HTTP_METHOD
  const originalSessionSecret = process.env.SECRET_HTTP_COOKIE_SESSION_SECRET

  afterEach(() => {
    vi.restoreAllMocks()
    globalThis.ReadableStream = originalReadableStream

    if (typeof originalSecretMethod === 'undefined') delete process.env.SECRET_HTTP_METHOD
    else process.env.SECRET_HTTP_METHOD = originalSecretMethod

    if (typeof originalSessionSecret === 'undefined')
      delete process.env.SECRET_HTTP_COOKIE_SESSION_SECRET
    else process.env.SECRET_HTTP_COOKIE_SESSION_SECRET = originalSessionSecret
  })

  it('should merge secret env config into nested http config on mount', async () => {
    process.env.SECRET_HTTP_METHOD = 'GET'
    process.env.SECRET_HTTP_COOKIE_SESSION_SECRET = 'env-secret'

    const http = new Http()
    const logger = createLogger()
    const next = vi.fn(async () => undefined)

    await http.onMount(
      {
        config: {
          plugins: {
            http: {
              config: {
                cookie: {
                  domain: 'example.com',
                },
              },
            },
          },
        },
        context: Object.create(null),
        event: Object.create(null),
        logger,
      } as any,
      next,
    )

    expect(http.config).toMatchObject({
      method: 'GET',
      cookie: {
        domain: 'example.com',
        session: {
          secret: 'env-secret',
        },
      },
    })
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('should convert thrown next errors into http responses', async () => {
    const http = new Http()
    const data = createInvokeData()

    await http.onInvoke(data as any, async () => {
      throw Error('next failed')
    })

    expect(data.response.statusCode).toBe(500)
    expect(data.response.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(data.response.body as ReadableStream)).toBe(
      '{"error":{"message":"next failed"}}',
    )
  })

  it('should fallback to status 500 when reading error.statusCode throws', async () => {
    const http = new Http()
    const logger = createLogger()
    const error = new Error('status getter failed')

    Object.defineProperty(error, 'statusCode', {
      configurable: true,
      get() {
        throw Error('status getter exploded')
      },
    })

    const data = createInvokeData({
      logger,
      response: error,
    })

    await http.onInvoke(data as any, async () => undefined)

    expect(data.response.statusCode).toBe(500)
    expect(await streamToString(data.response.body as ReadableStream)).toBe(
      '{"error":{"message":"status getter failed"}}',
    )
    expect(
      logger.error.mock.calls.some(
        (call) => call[0] instanceof Error && call[0].message === 'status getter exploded',
      ),
    ).toBe(true)
  })

  it('should fallback to the uncompressed body when compression setup throws', async () => {
    globalThis.ReadableStream = class BrokenReadableStream {
      constructor() {
        throw Error('stream unavailable')
      }
    } as any

    const http = new Http()
    const logger = createLogger()
    const payload = '1'.repeat(2048)
    const data = createInvokeData({
      event: {
        headers: {
          'accept-encoding': 'gzip',
        },
        body: null,
      },
      logger,
      response: payload,
    })

    await http.onInvoke(data as any, async () => undefined)

    expect(data.response.body).toBe(JSON.stringify({ data: payload }))
    expect(data.response.headers['Content-Encoding']).toBeUndefined()
    expect(logger.error).toHaveBeenCalledWith('Compression failed: %s', 'stream unavailable')
  })
})
