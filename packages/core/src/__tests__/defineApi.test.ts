import { describe, expect, it } from 'vitest'
import { defineApi, z } from '../index'

async function streamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  return await new Response(stream).text()
}

async function streamToObject(stream: ReadableStream<Uint8Array>): Promise<Record<string, any>> {
  return JSON.parse(await streamToString(stream))
}

function useHttpPlugin(func: { config: any }): void {
  func.config = {
    plugins: {
      http: {
        config: Object.create(null),
      },
    },
  }
}

describe('@faasjs/core defineApi', () => {
  it('auto loads http plugin and passes parsed params', async () => {
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

    const body = await streamToObject(response.body)

    expect(body).toEqual({
      data: {
        parsed: { name: 'FaasJS' },
        raw: { name: 'FaasJS' },
      },
    })
  })

  it('uses empty params object when schema is missing and http plugin exists', async () => {
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

    const body = await streamToObject(response.body)

    expect(body).toEqual({
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
          raw: data.event.params,
          knex: data.knex,
        }
      },
    })

    func.config = {
      plugins: Object.create(null),
    }

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

    const body = await streamToObject(response.body)

    expect(body).toEqual({
      error: {
        message:
          'Invalid params\npage: Too small, expected number to be >=1\nendAt: endAt must be greater than startedAt',
      },
    })
  })

  it('sets knex as undefined when knex plugin is not configured', async () => {
    const func = defineApi({
      async handler(data) {
        return {
          hasKnex: typeof data.knex !== 'undefined',
        }
      },
    })

    useHttpPlugin(func)

    const response: any = await func.export().handler({
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    })

    const body = await streamToObject(response.body)

    expect(body).toEqual({
      data: {
        hasKnex: false,
      },
    })
  })

  it('throws when plugin cannot be loaded', async () => {
    const func = defineApi({
      async handler() {
        return true
      },
    })

    func.config = {
      plugins: {
        unknown: {
          type: 'plugin_not_exists_for_core_define_func',
        },
      },
    }

    await expect(func.export().handler({})).rejects.toThrow(/Failed to load plugin "unknown"/)
  })

  it('supports loading plugin from named class export', async () => {
    const func = defineApi({
      async handler(data) {
        return {
          loaded: Boolean((data.context as any).namedPluginLoaded),
        }
      },
    })

    func.config = {
      plugins: {
        named: {
          type: './__tests__/named-plugin',
        },
        http: {
          config: Object.create(null),
        },
      },
    }

    const response = await func.export().handler({})

    expect((response as any).statusCode).toEqual(200)

    const body = await streamToObject((response as any).body)

    expect(body).toEqual({
      data: {
        loaded: true,
      },
    })
  })

  it('supports loading plugin from default class export', async () => {
    const func = defineApi({
      async handler(data) {
        return {
          loaded: Boolean((data.context as any).defaultPluginLoaded),
        }
      },
    })

    func.config = {
      plugins: {
        defaultClass: {
          type: './__tests__/default-plugin',
        },
        http: {
          config: Object.create(null),
        },
      },
    }

    const response = await func.export().handler({})

    expect((response as any).statusCode).toEqual(200)

    const body = await streamToObject((response as any).body)

    expect(body).toEqual({
      data: {
        loaded: true,
      },
    })
  })

  it('rejects object-wrapped class exports', async () => {
    const func = defineApi({
      async handler() {
        return true
      },
    })

    func.config = {
      plugins: {
        object: {
          type: './__tests__/object-plugin',
        },
      },
    }

    await expect(func.export().handler({})).rejects.toThrow(
      /Supported exports are named class "TestsObjectPlugin" or default class export/,
    )
  })
})
