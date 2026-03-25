import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { loadConfig } from '../load_config'
import { Logger } from '../logger'

describe('loadConfig', () => {
  it('defaults', () => {
    const config = loadConfig(__dirname, `${__dirname}/fake.func.ts`, 'defaults')

    expect(config.plugins?.test?.type).toEqual('defaults')
    expect(config.plugins?.func?.name).toEqual('func')
  })

  it('local', () => {
    const config = loadConfig(__dirname, `${__dirname}/fake.func.ts`, 'local')

    expect(config.plugins?.func?.type).toEqual('function')
    expect(config.plugins?.func?.name).toEqual('func')

    expect(config.plugins?.test?.type).toEqual('local')
    expect(config.plugins?.func?.config?.env).toEqual('defaults')
  })

  it('sub local', () => {
    const config = loadConfig(__dirname, `${__dirname}/sub/fake.func.ts`, 'local')

    expect(config.plugins?.func?.type).toEqual('function')
    expect(config.plugins?.func?.name).toEqual('func')

    expect(config.plugins?.test?.type).toEqual('sublocal')
  })

  it('should throw when server.root is not string', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-load-config-'))

    try {
      const src = join(root, 'src')

      mkdirSync(src, {
        recursive: true,
      })

      writeFileSync(
        join(src, 'faas.yaml'),
        `defaults:
  server:
    root: 1
`,
      )

      expect(() => loadConfig(src, join(src, 'fake.func.ts'), 'development')).toThrow(
        /"defaults\.server\.root": Invalid input: expected string, received number/,
      )
    } finally {
      rmSync(root, {
        recursive: true,
        force: true,
      })
    }
  })

  it('should throw when server.base is not string', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-load-config-'))

    try {
      const src = join(root, 'src')

      mkdirSync(src, {
        recursive: true,
      })

      writeFileSync(
        join(src, 'faas.yaml'),
        `defaults:
  server:
    base: 1
`,
      )

      expect(() => loadConfig(src, join(src, 'fake.func.ts'), 'development')).toThrow(
        /"defaults\.server\.base": Invalid input: expected string, received number/,
      )
    } finally {
      rmSync(root, {
        recursive: true,
        force: true,
      })
    }
  })

  it('should throw when server is not object', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-load-config-'))

    try {
      const src = join(root, 'src')

      mkdirSync(src, {
        recursive: true,
      })

      writeFileSync(
        join(src, 'faas.yaml'),
        `defaults:
  server: 1
`,
      )

      expect(() => loadConfig(src, join(src, 'fake.func.ts'), 'development')).toThrow(
        /"defaults\.server": Invalid input: expected object, received number/,
      )
    } finally {
      rmSync(root, {
        recursive: true,
        force: true,
      })
    }
  })

  it('should throw when root config is not object', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-load-config-'))

    try {
      const src = join(root, 'src')

      mkdirSync(src, {
        recursive: true,
      })

      writeFileSync(join(src, 'faas.yaml'), '- item\n')

      expect(() => loadConfig(src, join(src, 'fake.func.ts'), 'development')).toThrow(
        /"<root>": Invalid input: expected object, received array/,
      )
    } finally {
      rmSync(root, {
        recursive: true,
        force: true,
      })
    }
  })

  it('should throw when staging config is not object', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-load-config-'))

    try {
      const src = join(root, 'src')

      mkdirSync(src, {
        recursive: true,
      })

      writeFileSync(
        join(src, 'faas.yaml'),
        `development: 1
`,
      )

      expect(() => loadConfig(src, join(src, 'fake.func.ts'), 'development')).toThrow(
        /"development": Invalid input: expected object, received number/,
      )
    } finally {
      rmSync(root, {
        recursive: true,
        force: true,
      })
    }
  })

  it('should return defaults when staging config is missing', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-load-config-'))

    try {
      const src = join(root, 'src')

      mkdirSync(src, {
        recursive: true,
      })

      writeFileSync(
        join(src, 'faas.yaml'),
        `defaults:
  plugins:
    demo:
      type: test
`,
      )

      const config = loadConfig(src, join(src, 'fake.func.ts'), 'production')

      expect(config.plugins?.demo?.type).toBe('test')
      expect(config.plugins?.demo?.name).toBe('demo')
    } finally {
      rmSync(root, {
        recursive: true,
        force: true,
      })
    }
  })

  it('should preserve custom stage fields', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-load-config-'))

    try {
      const src = join(root, 'src')

      mkdirSync(src, {
        recursive: true,
      })

      writeFileSync(
        join(src, 'faas.yaml'),
        `defaults:
  custom:
    enabled: true
development:
  custom:
    mode: local
`,
      )

      const config = loadConfig(src, join(src, 'fake.func.ts'), 'development')

      expect(config.custom).toEqual({
        enabled: true,
        mode: 'local',
      })
    } finally {
      rmSync(root, {
        recursive: true,
        force: true,
      })
    }
  })

  it('should return empty object for empty faas.yaml', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-load-config-'))

    try {
      const src = join(root, 'src')

      mkdirSync(src, {
        recursive: true,
      })

      writeFileSync(join(src, 'faas.yaml'), '\n')

      const config = loadConfig(src, join(src, 'fake.func.ts'), 'development')

      expect(config).toEqual({})
    } finally {
      rmSync(root, {
        recursive: true,
        force: true,
      })
    }
  })

  it('should throw when staging config is null', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-load-config-'))

    try {
      const src = join(root, 'src')

      mkdirSync(src, {
        recursive: true,
      })

      writeFileSync(
        join(src, 'faas.yaml'),
        `development:
`,
      )

      expect(() => loadConfig(`${src}/`, join(src, 'fake.func.ts'), 'development')).toThrow(
        /"development": Invalid input: expected object, received null/,
      )
    } finally {
      rmSync(root, {
        recursive: true,
        force: true,
      })
    }
  })

  it('should accept server.base and external logger label', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-load-config-'))

    try {
      const src = join(root, 'src')

      mkdirSync(src, {
        recursive: true,
      })

      writeFileSync(
        join(src, 'faas.yaml'),
        `defaults:
  server:
    base: /api
`,
      )

      const config = loadConfig(`${src}/`, join(src, 'fake.func.ts'), 'defaults', new Logger('app'))

      expect(config.server.base).toBe('/api')
    } finally {
      rmSync(root, {
        recursive: true,
        force: true,
      })
    }
  })

  it('should load anchors and aliases in faas.yaml', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-load-config-'))

    try {
      const src = join(root, 'src')

      mkdirSync(src, {
        recursive: true,
      })

      writeFileSync(
        join(src, 'faas.yaml'),
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
      )

      const config = loadConfig(src, join(src, 'fake.func.ts'), 'development')

      expect(config.plugins?.base?.type).toEqual('http')
      expect(config.plugins?.local?.type).toEqual('mysql')
    } finally {
      rmSync(root, {
        recursive: true,
        force: true,
      })
    }
  })
})
