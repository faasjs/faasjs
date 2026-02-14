import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadConfig } from '../load_config'

describe('loadConfig', () => {
  it('defaults', () => {
    const config = loadConfig(
      __dirname,
      `${__dirname}/fake.func.ts`,
      'defaults'
    )

    expect(config.plugins.test.type).toEqual('defaults')
    expect(config.plugins.func.name).toEqual('func')
  })

  it('local', () => {
    const config = loadConfig(__dirname, `${__dirname}/fake.func.ts`, 'local')

    expect(config.plugins.func.type).toEqual('function')
    expect(config.plugins.func.name).toEqual('func')

    expect(config.plugins.test.type).toEqual('local')
    expect(config.plugins.func.config.env).toEqual('defaults')
  })

  it('sub local', () => {
    const config = loadConfig(
      __dirname,
      `${__dirname}/sub/fake.func.ts`,
      'local'
    )

    expect(config.plugins.func.type).toEqual('function')
    expect(config.plugins.func.name).toEqual('func')

    expect(config.plugins.test.type).toEqual('sublocal')
  })

  it('should throw when types config exists', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-load-config-'))

    try {
      const src = join(root, 'src')

      mkdirSync(src, {
        recursive: true,
      })

      writeFileSync(
        join(src, 'faas.yaml'),
        `defaults:
  types:
    enabled: true
`
      )

      expect(() =>
        loadConfig(src, join(src, 'fake.func.ts'), 'development')
      ).toThrow('defaults.types')
    } finally {
      rmSync(root, {
        recursive: true,
        force: true,
      })
    }
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
`
      )

      expect(() =>
        loadConfig(src, join(src, 'fake.func.ts'), 'development')
      ).toThrow('defaults.server.root')
    } finally {
      rmSync(root, {
        recursive: true,
        force: true,
      })
    }
  })
})
