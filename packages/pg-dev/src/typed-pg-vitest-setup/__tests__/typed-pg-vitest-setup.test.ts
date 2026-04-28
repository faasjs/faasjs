import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type Awaitable<T> = T | Promise<T>
type AsyncVoidMock = () => Promise<void>
type AfterAllMock = (callback: () => Awaitable<void>) => void
type BeforeEachMock = (callback: () => Awaitable<void>) => void
type DatabaseBootstrapMock = () => Promise<void>
type CreateTestingPostgresMock = (databaseUrl: string) => { end: ReturnType<typeof vi.fn> }
type ResetTestingDatabaseMock = (
  sql: { end: ReturnType<typeof vi.fn> },
  excludeTables: string[],
) => Promise<void>
type ClientLike = {
  quit: ReturnType<typeof vi.fn>
}
type TestingServer = {
  databaseUrl: string
  stop: ReturnType<typeof vi.fn>
}

describe('typed-pg-vitest setup helper', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL
  let registeredAfterAll: (() => Awaitable<void>) | undefined
  let registeredBeforeEach: (() => Awaitable<void>) | undefined
  let registeredDatabaseBootstrap: DatabaseBootstrapMock | undefined

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    registeredAfterAll = undefined
    registeredBeforeEach = undefined
    registeredDatabaseBootstrap = undefined
    delete process.env.DATABASE_URL
  })

  afterEach(() => {
    if (typeof originalDatabaseUrl === 'string') process.env.DATABASE_URL = originalDatabaseUrl
    else delete process.env.DATABASE_URL
  })

  function createProjectRoot({ withMigration = true } = {}) {
    const projectRoot = mkdtempSync(join(tmpdir(), 'typed-pg-vitest-setup-'))

    if (withMigration) {
      const migrationsDir = join(projectRoot, 'migrations')

      mkdirSync(migrationsDir, { recursive: true })
      writeFileSync(
        join(migrationsDir, '20250101000000_create_users.ts'),
        'export function up() {}\n',
      )
    }

    return projectRoot
  }

  function createTestingServer(databaseUrl = 'postgresql://worker-1'): TestingServer {
    return {
      databaseUrl,
      stop: vi.fn<AsyncVoidMock>(async () => undefined),
    }
  }

  async function loadSetupModule(
    options: {
      cachedClients?: ClientLike[]
      projectRoot?: string
      resetImplementation?: () => Promise<void>
      startServerImplementation?: () => Promise<TestingServer>
      migrateImplementation?: () => Promise<void>
    } = {},
  ) {
    const end = vi.fn<AsyncVoidMock>(async () => undefined)
    const sql = { end }
    const beforeEach = vi.fn<BeforeEachMock>((callback) => {
      registeredBeforeEach = callback
    })
    const afterAll = vi.fn<AfterAllMock>((callback) => {
      registeredAfterAll = callback
    })
    const getClients = vi.fn<() => ClientLike[]>(() => options.cachedClients ?? [])
    const registerDatabaseBootstrap = vi.fn((bootstrap: DatabaseBootstrapMock) => {
      registeredDatabaseBootstrap = bootstrap
    })
    const migrationClient = {
      quit: vi.fn<AsyncVoidMock>(async () => undefined),
    }
    const createClient = vi.fn(() => migrationClient)
    const migrate = vi.fn(
      options.migrateImplementation
        ? () => options.migrateImplementation?.()
        : async () => undefined,
    )
    const Migrator = vi.fn(
      class {
        migrate = migrate
      },
    )
    const createTestingPostgres = vi.fn<CreateTestingPostgresMock>(() => sql)
    const resetTestingDatabase = vi.fn<ResetTestingDatabaseMock>(
      options.resetImplementation
        ? async () => options.resetImplementation?.()
        : async () => undefined,
    )
    const startPGliteServer = vi.fn(
      options.startServerImplementation
        ? () => options.startServerImplementation?.()
        : async () => createTestingServer(),
    )

    vi.doMock('@faasjs/pg', () => ({
      Migrator,
      createClient,
      getClients,
      registerDatabaseBootstrap,
    }))
    vi.doMock('../../pglite', () => ({
      startPGliteServer,
    }))
    vi.doMock('../../postgres', () => ({
      createTestingPostgres,
    }))
    vi.doMock('../../testing', () => ({
      resetTestingDatabase,
    }))

    const module = await import('../../setup-helper')

    module.setupTypedPgVitest({
      afterAll,
      beforeEach,
      projectRoot: options.projectRoot ?? createProjectRoot(),
    })

    return {
      mocks: {
        Migrator,
        afterAll,
        beforeEach,
        createClient,
        createTestingPostgres,
        end,
        getClients,
        migrate,
        migrationClient,
        registerDatabaseBootstrap,
        resetTestingDatabase,
        startPGliteServer,
      },
      sql,
    }
  }

  it('registers a lazy bootstrap, starts PGlite on first use, and wires reset hooks', async () => {
    const firstClient = {
      quit: vi.fn<AsyncVoidMock>(async () => undefined),
    }
    const secondClient = {
      quit: vi.fn<AsyncVoidMock>(async () => undefined),
    }
    const projectRoot = createProjectRoot()

    const { mocks, sql } = await loadSetupModule({
      cachedClients: [firstClient, secondClient],
      projectRoot,
    })

    expect(process.env.DATABASE_URL).toBeUndefined()
    expect(mocks.beforeEach).toHaveBeenCalledTimes(1)
    expect(mocks.afterAll).toHaveBeenCalledTimes(1)
    expect(mocks.registerDatabaseBootstrap).toHaveBeenCalledTimes(1)
    expect(registeredDatabaseBootstrap).toBeTypeOf('function')

    await expect(registeredDatabaseBootstrap?.()).resolves.toBeUndefined()

    expect(process.env.DATABASE_URL).toBe('postgresql://worker-1')
    expect(mocks.startPGliteServer).toHaveBeenCalledTimes(1)
    expect(mocks.createClient).toHaveBeenNthCalledWith(1, 'postgresql://worker-1', {
      max: 1,
      ssl: false,
    })
    expect(mocks.createClient).toHaveBeenNthCalledWith(2, 'postgresql://worker-1')
    expect(mocks.Migrator).toHaveBeenCalledWith({
      client: mocks.migrationClient,
      folder: join(projectRoot, 'migrations'),
    })
    expect(mocks.migrationClient.quit).toHaveBeenCalledTimes(1)

    await registeredBeforeEach?.()

    expect(mocks.getClients).toHaveBeenCalledTimes(1)
    expect(firstClient.quit).toHaveBeenCalledTimes(1)
    expect(secondClient.quit).toHaveBeenCalledTimes(1)
    expect(mocks.createTestingPostgres).toHaveBeenCalledWith('postgresql://worker-1')
    expect(mocks.resetTestingDatabase).toHaveBeenCalledWith(sql, ['typed_pg_migrations'])
    expect(mocks.end).toHaveBeenCalledTimes(1)

    await registeredAfterAll?.()

    expect(mocks.getClients).toHaveBeenCalledTimes(2)
    expect(firstClient.quit).toHaveBeenCalledTimes(2)
    expect(secondClient.quit).toHaveBeenCalledTimes(2)

    const startedServer = await mocks.startPGliteServer.mock.results[0]?.value

    expect(startedServer?.stop).toHaveBeenCalledTimes(1)
  })

  it('skips reset work until a test actually boots the database', async () => {
    const { mocks } = await loadSetupModule({
      projectRoot: createProjectRoot({ withMigration: false }),
    })

    await registeredBeforeEach?.()

    expect(mocks.getClients).not.toHaveBeenCalled()
    expect(mocks.createTestingPostgres).not.toHaveBeenCalled()
    expect(mocks.resetTestingDatabase).not.toHaveBeenCalled()
  })

  it('still closes the sql client when the reset hook fails', async () => {
    const error = Error('reset failed')

    const { mocks } = await loadSetupModule({
      projectRoot: createProjectRoot(),
      resetImplementation: async () => Promise.reject(error),
    })

    await registeredDatabaseBootstrap?.()
    await expect(registeredBeforeEach?.()).rejects.toThrowError('reset failed')

    expect(mocks.end).toHaveBeenCalledTimes(1)
  })

  it('stops the testing server and allows a retry when migrations fail', async () => {
    const firstServer = createTestingServer('postgresql://worker-1')
    const secondServer = createTestingServer('postgresql://worker-2')
    const migrateError = Error('migrate failed')

    const { mocks } = await loadSetupModule({
      projectRoot: createProjectRoot(),
      migrateImplementation: vi
        .fn<() => Promise<void>>()
        .mockRejectedValueOnce(migrateError)
        .mockResolvedValueOnce(undefined),
      startServerImplementation: vi
        .fn<() => Promise<TestingServer>>()
        .mockResolvedValueOnce(firstServer)
        .mockResolvedValueOnce(secondServer),
    })

    await expect(registeredDatabaseBootstrap?.()).rejects.toThrowError('migrate failed')

    expect(firstServer.stop).toHaveBeenCalledTimes(1)
    expect(process.env.DATABASE_URL).toBeUndefined()

    await expect(registeredDatabaseBootstrap?.()).resolves.toBeUndefined()

    expect(secondServer.stop).not.toHaveBeenCalled()
    expect(process.env.DATABASE_URL).toBe('postgresql://worker-2')
    expect(mocks.createClient).toHaveBeenCalledTimes(3)
  })
})
