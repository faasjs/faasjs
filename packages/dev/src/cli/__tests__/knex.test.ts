import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const mount = vi.fn(async () => undefined)
  const quit = vi.fn(async () => undefined)
  const migrateLatest = vi.fn(async () => undefined)
  const migrateRollback = vi.fn(async () => undefined)
  const migrateStatus = vi.fn(async () => 2)
  const migrateCurrentVersion = vi.fn(async () => '202602170001')
  const migrateMake = vi.fn(async (name: string) => `migration:${name}`)

  const useKnex = vi.fn(() => ({
    name: 'test-knex',
    config: {},
    mount,
    quit,
  }))

  class KnexSchema {
    migrateLatest = migrateLatest
    migrateRollback = migrateRollback
    migrateStatus = migrateStatus
    migrateCurrentVersion = migrateCurrentVersion
    migrateMake = migrateMake
  }

  const loadConfig = vi.fn(() => ({
    plugins: {
      knex: {
        config: {
          client: 'pg',
        },
      },
    },
  }))

  const resolveServerConfig = vi.fn((root: string) => ({
    root,
    base: '/',
    staging: 'development',
  }))

  return {
    mount,
    quit,
    migrateLatest,
    migrateRollback,
    migrateStatus,
    migrateCurrentVersion,
    migrateMake,
    useKnex,
    KnexSchema,
    loadConfig,
    resolveServerConfig,
  }
})

vi.mock('@faasjs/knex', () => ({
  useKnex: mocks.useKnex,
  KnexSchema: mocks.KnexSchema,
}))

vi.mock('@faasjs/node-utils', () => ({
  loadConfig: mocks.loadConfig,
}))

vi.mock('../../server_config', () => ({
  resolveServerConfig: mocks.resolveServerConfig,
}))

import { main } from '../index'

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('faas knex cli', () => {
  it('should print help text', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'knex', '--help'])

    expect(code).toBe(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage:'))
  })

  it('should print version text', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'knex', '--version'])

    expect(code).toBe(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/^v?\d+/))
  })

  it('should run latest migration', async () => {
    const code = await main(['node', 'faas', 'knex', 'latest'])

    expect(code).toBe(0)
    expect(mocks.resolveServerConfig).toHaveBeenCalledWith(process.cwd())
    expect(mocks.loadConfig).toHaveBeenCalledWith(
      `${process.cwd()}/src`,
      `${process.cwd()}/src/index.func.ts`,
      'development',
    )
    expect(mocks.useKnex).toHaveBeenCalledWith({
      config: {
        client: 'pg',
      },
    })
    expect(mocks.mount).toHaveBeenCalledTimes(1)
    expect(mocks.migrateLatest).toHaveBeenCalledTimes(1)
    expect(mocks.quit).toHaveBeenCalledTimes(1)
  })

  it('should pass root option to server resolver', async () => {
    const customRoot = '/tmp/custom-root'
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'knex', 'status', '--root', customRoot])

    expect(code).toBe(0)
    expect(mocks.resolveServerConfig).toHaveBeenCalledWith(customRoot)
    expect(logSpy).toHaveBeenCalledWith(2)
  })

  it('should run rollback migration', async () => {
    const code = await main(['node', 'faas', 'knex', 'rollback'])

    expect(code).toBe(0)
    expect(mocks.migrateRollback).toHaveBeenCalledTimes(1)
  })

  it('should print migration status', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'knex', 'status'])

    expect(code).toBe(0)
    expect(mocks.migrateStatus).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith(2)
  })

  it('should print current migration version', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'knex', 'current'])

    expect(code).toBe(0)
    expect(mocks.migrateCurrentVersion).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith('202602170001')
  })

  it('should create migration file with make action', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'knex', 'make', 'create_users'])

    expect(code).toBe(0)
    expect(mocks.migrateMake).toHaveBeenCalledWith('create_users')
    expect(logSpy).toHaveBeenCalledWith('migration:create_users')
  })

  it('should return error for unknown action', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'knex', 'unknown'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith('[faas knex] Unknown action: unknown')
  })

  it('should return error when migration name is missing', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'knex', 'make'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith(
      '[faas knex] Missing migration name. Usage: faas knex make create_users',
    )
  })
})
