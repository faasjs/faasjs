import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { defineApi, z, type InvokeData, type Next, type Plugin } from '../../../core/src'
import { loadPlugins } from '../load_plugins'

async function streamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  return await new Response(stream).text()
}

async function streamToObject(stream: ReadableStream<Uint8Array>): Promise<Record<string, any>> {
  return JSON.parse(await streamToString(stream))
}

const roots: string[] = []

function createProject(files: Record<string, string>): { root: string; src: string } {
  const root = mkdtempSync(join(tmpdir(), 'faasjs-prepare-'))
  const src = join(root, 'src')

  roots.push(root)

  for (const [file, content] of Object.entries(files)) {
    const path = join(root, file)
    mkdirSync(join(path, '..'), {
      recursive: true,
    })
    writeFileSync(path, content)
  }

  return { root, src }
}

afterEach(() => {
  for (const root of roots.splice(0, roots.length))
    rmSync(root, {
      force: true,
      recursive: true,
    })
})

describe('loadPlugins', () => {
  it('loads faas.yaml plugins and keeps http as the only built-in plugin', async () => {
    const { src } = createProject({
      'src/faas.yaml': `defaults:
  plugins:
    auth:
      type: file://./auth-plugin.ts
    http:
      config: {}
`,
      'src/auth-plugin.ts': `export default class AuthPlugin {
  constructor(config) {
    this.name = config.name
    this.type = config.type
  }

  async onInvoke(data, next) {
    data.current_user = {
      id: 1,
      source: 'yaml',
    }

    await next()
  }
}
`,
    })

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

    func.filename = join(src, 'demo.func.ts')

    await loadPlugins(func, {
      root: src,
      filename: func.filename,
      staging: 'defaults',
    })

    const response: any = await func.export().handler({
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'FaasJS' }),
    })

    expect(func.plugins.some((plugin) => plugin.type === 'http')).toEqual(true)
    expect(await streamToObject(response.body)).toEqual({
      data: {
        current_user: {
          id: 1,
          source: 'yaml',
        },
        params: {
          name: 'FaasJS',
        },
      },
    })
  })

  it('skips yaml plugin entries when the same plugin name is already injected in code', async () => {
    const { src } = createProject({
      'src/faas.yaml': `defaults:
  plugins:
    auth:
      type: file://./auth-plugin.ts
    http:
      config: {}
`,
      'src/auth-plugin.ts': `export default class AuthPlugin {
  constructor(config) {
    this.name = config.name
    this.type = config.type
  }

  async onInvoke(data, next) {
    data.current_user = {
      source: 'yaml',
    }

    await next()
  }
}
`,
    })

    class ManualAuthPlugin implements Plugin {
      public readonly name = 'auth'
      public readonly type = 'manual-auth'

      public async onInvoke(data: InvokeData, next: Next) {
        data.current_user = {
          source: 'code',
        }

        await next()
      }
    }

    const func = defineApi({
      async handler(data) {
        return data.current_user
      },
    })

    func.filename = join(src, 'demo.func.ts')
    func.plugins.unshift(new ManualAuthPlugin())

    await loadPlugins(func, {
      root: src,
      filename: func.filename,
      staging: 'defaults',
    })

    const response: any = await func.export().handler({})

    expect(func.plugins.filter((plugin) => plugin.name === 'auth')).toHaveLength(1)
    expect(await streamToObject(response.body)).toEqual({
      data: {
        source: 'code',
      },
    })
  })

  it('requires an explicit type for non-http yaml plugins', async () => {
    const { src } = createProject({
      'src/faas.yaml': `defaults:
  plugins:
    auth:
      config: {}
`,
    })

    const func = defineApi({
      async handler() {
        return true
      },
    })

    func.filename = join(src, 'demo.func.ts')

    await expect(
      loadPlugins(func, {
        root: src,
        filename: func.filename,
        staging: 'defaults',
      }),
    ).rejects.toThrow(/requires an explicit "type"/)
  })

  it('rejects relative plugin paths and asks for explicit file urls', async () => {
    const { src } = createProject({
      'src/faas.yaml': `defaults:
  plugins:
    auth:
      type: ./auth-plugin.ts
`,
    })

    const func = defineApi({
      async handler() {
        return true
      },
    })

    func.filename = join(src, 'demo.func.ts')

    await expect(
      loadPlugins(func, {
        root: src,
        filename: func.filename,
        staging: 'defaults',
      }),
    ).rejects.toThrow(/Relative plugin type/)
  })

  it('requires config-driven plugins to default export a lifecycle class', async () => {
    const { src } = createProject({
      'src/faas.yaml': `defaults:
  plugins:
    auth:
      type: file://./auth-plugin.ts
`,
      'src/auth-plugin.ts': `export class AuthPlugin {
  async onInvoke(_data, next) {
    await next()
  }
}
`,
    })

    const func = defineApi({
      async handler() {
        return true
      },
    })

    func.filename = join(src, 'demo.func.ts')

    await expect(
      loadPlugins(func, {
        root: src,
        filename: func.filename,
        staging: 'defaults',
      }),
    ).rejects.toThrow(/must default export a lifecycle plugin class/)
  })
})
