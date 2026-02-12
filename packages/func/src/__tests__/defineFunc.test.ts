import { describe, expect, it } from 'vitest'
import { defineFunc } from '../index'

async function streamToString(
  stream: ReadableStream<Uint8Array>
): Promise<string> {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  return new TextDecoder().decode(
    Buffer.concat(chunks.map(c => Buffer.from(c)))
  )
}

describe('defineFunc', () => {
  it('auto loads plugin by key when type is missing', async () => {
    const func = defineFunc(async ({ event }) => event.params?.name)

    func.config = {
      plugins: {
        http: {
          config: Object.create(null),
        },
      },
    }

    const response: any = await func.export().handler({
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'FaasJS' }),
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(response.body)).toEqual('{"data":"FaasJS"}')
  })

  it('throws when plugin cannot be loaded', async () => {
    const func = defineFunc(async () => true)

    func.config = {
      plugins: {
        unknown: {
          type: 'plugin_not_exists_for_define_func',
        },
      },
    }

    await expect(func.export().handler({})).rejects.toThrow(
      /Failed to load plugin "unknown"/
    )
  })

  it('does not load duplicated plugin names from config', async () => {
    const func = defineFunc(async () => true)

    func.config = {
      plugins: {
        http_a: {
          type: 'http',
          name: 'same_http',
        },
        http_b: {
          type: 'http',
          name: 'same_http',
        },
      },
    }

    const response: any = await func.export().handler({
      headers: {},
      body: null,
    })

    expect(response.statusCode).toEqual(200)
    expect(func.plugins.filter(p => p.name === 'same_http')).toHaveLength(1)
  })
})
