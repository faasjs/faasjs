import { Http, defineApi } from '@faasjs/core'
import { z } from '@faasjs/utils'
import { describe, expect, it } from 'vitest'

import { TestsAuthPlugin } from './auth-plugin'

async function streamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  return await new Response(stream).text()
}

async function streamToObject(stream: ReadableStream<Uint8Array>): Promise<Record<string, any>> {
  return JSON.parse(await streamToString(stream))
}

function useHttpPlugin(func: { plugins: any[] }): void {
  func.plugins.unshift(new Http({ config: { cookie: { session: { secret: 'test-secret' } } } }))
}

describe('@faasjs/core defineApi', () => {
  it('parses params when http plugin is injected', async () => {
    const func = defineApi({
      schema: z.object({
        name: z.string().optional(),
      }),
      async handler(data) {
        return {
          parsed: data.params,
          raw: data.event.params,
        }
      },
    })

    useHttpPlugin(func)

    const response: any = await func.export().handler({
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'FaasJS' }),
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toBeInstanceOf(ReadableStream)
    expect(await streamToObject(response.body)).toEqual({
      data: {
        parsed: { name: 'FaasJS' },
        raw: { name: 'FaasJS' },
      },
    })
  })

  it('uses empty params object when schema is missing', async () => {
    const func = defineApi({
      async handler(data) {
        return {
          params: data.params,
          raw: data.event.params,
        }
      },
    })

    useHttpPlugin(func)

    const response: any = await func.export().handler({
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'FaasJS' }),
    })

    expect(response.statusCode).toEqual(200)
    expect(await streamToObject(response.body)).toEqual({
      data: {
        params: {},
        raw: { name: 'FaasJS' },
      },
    })
  })

  it('requires http plugin when invoking api', async () => {
    const func = defineApi({
      schema: z.object({
        page: z.coerce.number().int().min(1),
      }),
      async handler(data) {
        return {
          params: data.params,
        }
      },
    })

    await expect(
      func.export().handler({
        params: {
          page: 0,
        },
      }),
    ).rejects.toThrow(/Missing required "http" plugin/)
  })

  it('formats zod validation message in faasjs style', async () => {
    const func = defineApi({
      schema: z
        .object({
          page: z.coerce.number().int().min(1),
          startedAt: z.coerce.number(),
          endAt: z.coerce.number(),
        })
        .refine((data) => data.endAt > data.startedAt, {
          path: ['endAt'],
          message: 'endAt must be greater than startedAt',
        }),
      async handler() {
        return true
      },
    })

    useHttpPlugin(func)

    const response: any = await func.export().handler({
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        page: 0,
        startedAt: 2,
        endAt: 1,
      }),
    })

    expect(response.statusCode).toEqual(400)
    expect(await streamToObject(response.body)).toEqual({
      error: {
        message:
          'Invalid params\npage: Too small, expected number to be >=1\nendAt: endAt must be greater than startedAt',
      },
    })
  })

  it('supports manually injected plugin data alongside params', async () => {
    const func = defineApi({
      schema: z.object({
        name: z.string(),
      }),
      async handler(data) {
        return {
          current_user: data.current_user,
          params: data.params,
        }
      },
    })

    func.plugins.unshift(
      new TestsAuthPlugin({
        name: 'auth',
        type: 'auth',
      }),
    )
    useHttpPlugin(func)

    const response: any = await func.export().handler({
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'FaasJS' }),
    })

    expect(response.statusCode).toEqual(200)
    expect(await streamToObject(response.body)).toEqual({
      data: {
        current_user: {
          id: 1,
          name: 'FaasJS',
        },
        params: {
          name: 'FaasJS',
        },
      },
    })
  })

  it('formats root-level zod errors with a <root> path label', async () => {
    const func = defineApi({
      schema: z.string().min(3),
      async handler() {
        return true
      },
    })

    useHttpPlugin(func)

    const response: any = await func.export().handler({
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        value: 'x',
      }),
    })

    expect(response.statusCode).toEqual(400)
    expect((await streamToObject(response.body)).error.message).toContain('<root>:')
  })

  it('returns invalid json errors before schema validation', async () => {
    const func = defineApi({
      schema: z.object({
        name: z.string(),
      }),
      async handler(data) {
        return data.params
      },
    })

    useHttpPlugin(func)

    const response: any = await func.export().handler({
      headers: { 'content-type': 'application/json' },
      queryString: { name: 'from-query' },
      body: '{bad-json',
    })

    expect(response.statusCode).toEqual(400)
    expect(await streamToObject(response.body)).toEqual({
      error: {
        message: 'Invalid JSON request body',
      },
    })
  })
})
