import { describe, expect, it } from 'vitest'
import { defineFunc, z } from '../index'

async function streamToString(
  stream: ReadableStream<Uint8Array>
): Promise<string> {
  return await new Response(stream).text()
}

async function streamToObject(
  stream: ReadableStream<Uint8Array>
): Promise<Record<string, any>> {
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

describe('@faasjs/core defineFunc', () => {
  it('auto loads http plugin and passes parsed params', async () => {
    const func = defineFunc({
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
    const func = defineFunc({
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

  it('skips params validation when http plugin is not configured', async () => {
    const func = defineFunc({
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

    const response: any = await func.export().handler({
      params: {
        page: 0,
      },
    })

    expect(response).toEqual({
      params: undefined,
      raw: {
        page: 0,
      },
      knex: undefined,
    })
  })

  it('formats zod validation message in faasjs style', async () => {
    const func = defineFunc({
      schema: z
        .object({
          page: z.coerce.number().int().min(1),
          startedAt: z.coerce.number(),
          endAt: z.coerce.number(),
        })
        .refine(data => data.endAt > data.startedAt, {
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
    const func = defineFunc({
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
    const func = defineFunc({
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

    await expect(func.export().handler({})).rejects.toThrow(
      /Failed to load plugin "unknown"/
    )
  })

  it('supports loading plugin from named class export', async () => {
    const func = defineFunc({
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
      },
    }

    const response = await func.export().handler({})

    expect(response).toEqual({
      loaded: true,
    })
  })

  it('supports loading plugin from default class export', async () => {
    const func = defineFunc({
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
      },
    }

    const response = await func.export().handler({})

    expect(response).toEqual({
      loaded: true,
    })
  })

  it('rejects object-wrapped class exports', async () => {
    const func = defineFunc({
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
      /Supported exports are named class "TestsObjectPlugin" or default class export/
    )
  })
})
