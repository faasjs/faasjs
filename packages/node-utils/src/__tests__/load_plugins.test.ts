import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

import { defineApi, z, type InvokeData, type Next, type Plugin } from '@faasjs/core'
import { afterEach, describe, expect, it } from 'vitest'

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
      config:
        cookie:
          session:
            secret: test-secret
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

    func.filename = join(src, 'demo.api.ts')

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
      config:
        cookie:
          session:
            secret: test-secret
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

    func.filename = join(src, 'demo.api.ts')
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

  it('applies merged config to an already-registered plugin instance', async () => {
    const { src } = createProject({
      'src/faas.yaml': `defaults:
  plugins:
    auth:
      type: ./plugins/auth-plugin.ts
      config:
        provider: jwt
        secret: from-root
    http:
      config:
        cookie:
          session:
            secret: test-secret
`,
      'src/admin/faas.yaml': `defaults:
  plugins:
    auth:
      config:
        region: apac
        secret: from-admin
`,
      'src/plugins/auth-plugin.ts': `export class AuthPlugin {
  async onInvoke(_data, next) {
    await next()
  }
}
`,
    })

    class ManualAuthPlugin implements Plugin {
      public readonly name = 'auth'
      public readonly type = 'manual-auth'
      public config: Record<string, any> = {
        source: 'manual-instance',
      }
      public resolvedType?: string

      public applyConfig(config: { type: string; name: string; config?: Record<string, any> }) {
        this.resolvedType = config.type
        this.config = {
          ...this.config,
          ...config.config,
        }
      }

      public async onInvoke(data: InvokeData, next: Next) {
        data.current_user = {
          config: this.config,
          resolvedType: this.resolvedType,
        }

        await next()
      }
    }

    const func = defineApi({
      async handler(data) {
        return data.current_user
      },
    })

    func.filename = join(src, 'admin', 'demo.api.ts')
    func.plugins.unshift(new ManualAuthPlugin())
    func.config = {
      plugins: {
        auth: {
          config: {
            secret: 'from-code',
            scope: 'write',
          },
        },
      },
    }

    await loadPlugins(func, {
      root: src,
      filename: func.filename,
      staging: 'defaults',
    })

    const response: any = await func.export().handler({})

    expect(func.plugins.filter((plugin) => plugin.name === 'auth')).toHaveLength(1)
    expect(await streamToObject(response.body)).toEqual({
      data: {
        config: {
          provider: 'jwt',
          region: 'apac',
          scope: 'write',
          secret: 'from-code',
          source: 'manual-instance',
        },
        resolvedType: pathToFileURL(join(src, 'plugins', 'auth-plugin.ts')).href,
      },
    })
  })

  it('merges layered yaml config and lets code config override the same plugin id', async () => {
    const { src } = createProject({
      'src/faas.yaml': `defaults:
  plugins:
    auth:
      type: ./plugins/auth-plugin.ts
      config:
        provider: jwt
        secret: from-root
    http:
      config:
        cookie:
          session:
            secret: test-secret
`,
      'src/admin/faas.yaml': `defaults:
  plugins:
    auth:
      config:
        region: apac
        secret: from-admin
`,
      'src/plugins/auth-plugin.ts': `export class AuthPlugin {
  constructor(config) {
    this.name = config.name
    this.type = config.type
  }

  async onInvoke(data, next) {
    data.current_user = data.config.plugins.auth
    await next()
  }
}
`,
    })

    const func = defineApi({
      async handler(data) {
        return {
          config: data.config.plugins?.auth,
          current_user: data.current_user,
        }
      },
    })

    func.filename = join(src, 'admin', 'demo.api.ts')
    func.config = {
      plugins: {
        auth: {
          config: {
            secret: 'from-code',
            scope: 'write',
          },
        },
      },
    }

    await loadPlugins(func, {
      root: src,
      filename: func.filename,
      staging: 'defaults',
    })

    const response: any = await func.export().handler({})

    expect(func.plugins.filter((plugin) => plugin.name === 'auth')).toHaveLength(1)
    expect(await streamToObject(response.body)).toEqual({
      data: {
        config: {
          config: {
            provider: 'jwt',
            region: 'apac',
            scope: 'write',
            secret: 'from-code',
          },
          name: 'auth',
          type: pathToFileURL(join(src, 'plugins', 'auth-plugin.ts')).href,
        },
        current_user: {
          config: {
            provider: 'jwt',
            region: 'apac',
            scope: 'write',
            secret: 'from-code',
          },
          name: 'auth',
          type: pathToFileURL(join(src, 'plugins', 'auth-plugin.ts')).href,
        },
      },
    })
  })

  it('loads plugins declared only in code config', async () => {
    const { src } = createProject({
      'src/code-plugin.ts': `export class CodePlugin {
  constructor(config) {
    this.name = config.name
    this.type = config.type
  }

  async onInvoke(data, next) {
    data.current_user = {
      source: 'code-config',
    }

    await next()
  }
}
`,
    })

    const func = defineApi({
      async handler(data) {
        return data.current_user
      },
    })

    func.filename = join(src, 'demo.api.ts')
    func.config = {
      plugins: {
        auth: {
          type: './code-plugin.ts',
        },
        http: {
          config: {
            cookie: {
              session: {
                secret: 'test-secret',
              },
            },
          },
        },
      },
    }

    await loadPlugins(func, {
      root: src,
      filename: func.filename,
      staging: 'defaults',
    })

    const response: any = await func.export().handler({})

    expect(func.config.plugins?.auth).toMatchObject({
      name: 'auth',
      type: pathToFileURL(join(src, 'code-plugin.ts')).href,
    })
    expect(func.plugins.some((plugin) => plugin.name === 'auth')).toEqual(true)
    expect(func.plugins.some((plugin) => plugin.type === 'http')).toEqual(true)
    expect(await streamToObject(response.body)).toEqual({
      data: {
        source: 'code-config',
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

    func.filename = join(src, 'demo.api.ts')

    await expect(
      loadPlugins(func, {
        root: src,
        filename: func.filename,
        staging: 'defaults',
      }),
    ).rejects.toThrow(/requires an explicit "type"/)
  })

  it('resolves relative plugin paths from faas.yaml and loads named exports', async () => {
    const { src } = createProject({
      'src/faas.yaml': `defaults:
  plugins:
    auth:
      type: ./plugins/auth-plugin.ts
    http:
      config:
        cookie:
          session:
            secret: test-secret
`,
      'src/plugins/auth-plugin.ts': `export class AuthPlugin {
  constructor(config) {
    this.name = config.name
    this.type = config.type
  }

  async onInvoke(data, next) {
    data.current_user = {
      source: 'relative-path',
    }

    await next()
  }
}
`,
    })

    const func = defineApi({
      async handler(data) {
        return data.current_user
      },
    })

    func.filename = join(src, 'demo.api.ts')

    await loadPlugins(func, {
      root: src,
      filename: func.filename,
      staging: 'defaults',
    })

    const response: any = await func.export().handler({})

    expect(func.config.plugins?.auth).toMatchObject({
      name: 'auth',
      type: pathToFileURL(join(src, 'plugins', 'auth-plugin.ts')).href,
    })
    expect(await streamToObject(response.body)).toEqual({
      data: {
        source: 'relative-path',
      },
    })
  })

  it('requires config-driven plugins to export a lifecycle plugin class', async () => {
    const { src } = createProject({
      'src/faas.yaml': `defaults:
  plugins:
    auth:
      type: file://./auth-plugin.ts
`,
      'src/auth-plugin.ts': `export const AuthPlugin = {
  onInvoke() {},
}
`,
    })

    const func = defineApi({
      async handler() {
        return true
      },
    })

    func.filename = join(src, 'demo.api.ts')

    await expect(
      loadPlugins(func, {
        root: src,
        filename: func.filename,
        staging: 'defaults',
      }),
    ).rejects.toThrow(/must export a lifecycle plugin class/)
  })
})
