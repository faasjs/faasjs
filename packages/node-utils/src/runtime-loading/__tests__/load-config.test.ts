import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { describe, expect, it } from 'vitest'

import { Logger } from '../../logger'
import { loadConfig } from '../load-config'

const fixtureRoot = resolve(__dirname, 'fixtures')

function withFaasYamlFixture<T>(
  faasYaml: string,
  run: (src: string) => T,
  setup?: (src: string) => void,
): T {
  const root = mkdtempSync(join(tmpdir(), 'faas-load-config-'))

  try {
    const src = join(root, 'src')

    mkdirSync(src, {
      recursive: true,
    })

    setup?.(src)
    writeFileSync(join(src, 'faas.yaml'), faasYaml)

    return run(src)
  } finally {
    rmSync(root, {
      recursive: true,
      force: true,
    })
  }
}

describe('loadConfig', () => {
  it('defaults', () => {
    const config = loadConfig(fixtureRoot, `${fixtureRoot}/fake.api.ts`, 'defaults')

    expect(config.plugins?.test?.type).toEqual('defaults')
    expect(config.plugins?.api?.name).toEqual('api')
  })

  it('local', () => {
    const config = loadConfig(fixtureRoot, `${fixtureRoot}/fake.api.ts`, 'local')

    expect(config.plugins?.api?.type).toEqual('api')
    expect(config.plugins?.api?.name).toEqual('api')

    expect(config.plugins?.test?.type).toEqual('local')
    expect(config.plugins?.api?.config?.env).toEqual('defaults')
  })

  it('sub local', () => {
    const config = loadConfig(fixtureRoot, `${fixtureRoot}/sub/fake.api.ts`, 'local')

    expect(config.plugins?.api?.type).toEqual('api')
    expect(config.plugins?.api?.name).toEqual('api')

    expect(config.plugins?.test?.type).toEqual('sublocal')
  })

  it('should throw when server.root is not string', () => {
    withFaasYamlFixture(
      `defaults:
  server:
    root: 1
`,
      (src) => {
        expect(() => loadConfig(src, join(src, 'fake.api.ts'), 'development')).toThrow(
          /"defaults\.server\.root": Invalid input: expected string, received number/,
        )
      },
    )
  })

  it('should throw when server.base is not string', () => {
    withFaasYamlFixture(
      `defaults:
  server:
    base: 1
`,
      (src) => {
        expect(() => loadConfig(src, join(src, 'fake.api.ts'), 'development')).toThrow(
          /"defaults\.server\.base": Invalid input: expected string, received number/,
        )
      },
    )
  })

  it('should throw when server is not object', () => {
    withFaasYamlFixture(
      `defaults:
  server: 1
`,
      (src) => {
        expect(() => loadConfig(src, join(src, 'fake.api.ts'), 'development')).toThrow(
          /"defaults\.server": Invalid input: expected object, received number/,
        )
      },
    )
  })

  it('should throw when root config is not object', () => {
    withFaasYamlFixture('- item\n', (src) => {
      expect(() => loadConfig(src, join(src, 'fake.api.ts'), 'development')).toThrow(
        /"<root>": Invalid input: expected object, received array/,
      )
    })
  })

  it('should throw when staging config is not object', () => {
    withFaasYamlFixture(
      `development: 1
`,
      (src) => {
        expect(() => loadConfig(src, join(src, 'fake.api.ts'), 'development')).toThrow(
          /"development": Invalid input: expected object, received number/,
        )
      },
    )
  })

  it('should return defaults when staging config is missing', () => {
    withFaasYamlFixture(
      `defaults:
  plugins:
    demo:
      type: test
`,
      (src) => {
        const config = loadConfig(src, join(src, 'fake.api.ts'), 'production')

        expect(config.plugins?.demo?.type).toBe('test')
        expect(config.plugins?.demo?.name).toBe('demo')
      },
    )
  })

  it('should preserve custom stage fields', () => {
    withFaasYamlFixture(
      `defaults:
  custom:
    enabled: true
development:
  custom:
    mode: local
`,
      (src) => {
        const config = loadConfig(src, join(src, 'fake.api.ts'), 'development')

        expect(config.custom).toEqual({
          enabled: true,
          mode: 'local',
        })
      },
    )
  })

  it('should return empty object for empty faas.yaml', () => {
    withFaasYamlFixture('\n', (src) => {
      const config = loadConfig(src, join(src, 'fake.api.ts'), 'development')

      expect(config).toEqual({})
    })
  })

  it('should throw when staging config is null', () => {
    withFaasYamlFixture(
      `development:
`,
      (src) => {
        expect(() => loadConfig(`${src}/`, join(src, 'fake.api.ts'), 'development')).toThrow(
          /"development": Invalid input: expected object, received null/,
        )
      },
    )
  })

  it('should accept server.base and external logger label', () => {
    withFaasYamlFixture(
      `defaults:
  server:
    base: /api
`,
      (src) => {
        const config = loadConfig(
          `${src}/`,
          join(src, 'fake.api.ts'),
          'defaults',
          new Logger('app'),
        )

        expect(config.server.base).toBe('/api')
      },
    )
  })

  it('should load anchors and aliases in faas.yaml', () => {
    withFaasYamlFixture(
      `defaults: &defaults
  plugins:
    base:
      type: http
development:
  <<: *defaults
  plugins:
    local:
      type: mysql
`,
      (src) => {
        const config = loadConfig(src, join(src, 'fake.api.ts'), 'development')

        expect(config.plugins?.base?.type).toEqual('http')
        expect(config.plugins?.local?.type).toEqual('mysql')
      },
    )
  })

  it('should resolve relative file URL plugin type from faas.yaml directory', () => {
    withFaasYamlFixture(
      `defaults:
  plugins:
    demo:
      type: file://./plugins/demo.ts
`,
      (src) => {
        const pluginFile = join(src, 'plugins', 'demo.ts')
        const config = loadConfig(src, join(src, 'fake.api.ts'), 'development')

        expect(config.plugins?.demo?.type).toBe(pathToFileURL(pluginFile).href)
      },
      (src) => {
        const plugins = join(src, 'plugins')

        mkdirSync(plugins, {
          recursive: true,
        })

        writeFileSync(join(plugins, 'demo.ts'), 'export {}\n')
      },
    )
  })

  it('should resolve relative plugin type from faas.yaml directory', () => {
    withFaasYamlFixture(
      `defaults:
  plugins:
    demo:
      type: ./plugins/demo.ts
`,
      (src) => {
        const pluginFile = join(src, 'plugins', 'demo.ts')
        const config = loadConfig(src, join(src, 'fake.api.ts'), 'development')

        expect(config.plugins?.demo?.type).toBe(pathToFileURL(pluginFile).href)
      },
      (src) => {
        const plugins = join(src, 'plugins')

        mkdirSync(plugins, {
          recursive: true,
        })

        writeFileSync(join(plugins, 'demo.ts'), 'export {}\n')
      },
    )
  })
})
