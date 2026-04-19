import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type AsyncVoidMock = () => Promise<void>
type InjectMock = (key: string) => Record<string, string> | undefined
type BeforeEachMock = (callback: () => Promise<void>) => void
type CreateTestingPostgresMock = (databaseUrl: string) => { end: ReturnType<typeof vi.fn> }
type ResetTestingDatabaseMock = (
  sql: { end: ReturnType<typeof vi.fn> },
  excludeTables: string[],
) => Promise<void>
type ClientLike = {
  quit: ReturnType<typeof vi.fn>
}

describe('typed-pg-vitest setup', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL
  const originalPoolId = process.env.VITEST_POOL_ID
  let registeredBeforeEach: (() => Promise<void>) | undefined

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    registeredBeforeEach = undefined
    delete process.env.DATABASE_URL
    delete process.env.VITEST_POOL_ID
  })

  afterEach(() => {
    if (typeof originalDatabaseUrl === 'string') process.env.DATABASE_URL = originalDatabaseUrl
    else delete process.env.DATABASE_URL

    if (typeof originalPoolId === 'string') process.env.VITEST_POOL_ID = originalPoolId
    else delete process.env.VITEST_POOL_ID
  })

  async function loadSetupModule(options: {
    clients?: ClientLike[]
    databaseUrls?: Record<string, string>
    resetImplementation?: () => Promise<void>
  }) {
    const end = vi.fn<AsyncVoidMock>(async () => undefined)
    const sql = { end }
    const getClients = vi.fn<() => ClientLike[]>(() => options.clients ?? [])
    const inject = vi.fn<InjectMock>(() => options.databaseUrls)
    const beforeEach = vi.fn<BeforeEachMock>((callback) => {
      registeredBeforeEach = callback
    })
    const createTestingPostgres = vi.fn<CreateTestingPostgresMock>(() => sql)
    const resetTestingDatabase = vi.fn<ResetTestingDatabaseMock>(
      options.resetImplementation
        ? async () => options.resetImplementation?.()
        : async () => undefined,
    )

    vi.doMock('vitest', () => ({
      beforeEach,
      inject,
      vi,
    }))
    vi.doMock('../postgres', () => ({
      createTestingPostgres,
    }))
    vi.doMock('../testing', () => ({
      resetTestingDatabase,
    }))
    vi.doMock('@faasjs/pg', () => ({
      getClients,
    }))

    const module = await import('../typed-pg-vitest-setup')

    return {
      module,
      mocks: {
        beforeEach,
        createTestingPostgres,
        end,
        getClients,
        inject,
        resetTestingDatabase,
      },
      sql,
    }
  }

  it('sets DATABASE_URL from the current worker and registers a reset hook', async () => {
    process.env.VITEST_POOL_ID = '2'

    const { mocks, sql } = await loadSetupModule({
      databaseUrls: {
        '1': 'postgresql://worker-1',
        '2': 'postgresql://worker-2',
      },
    })

    expect(process.env.DATABASE_URL).toBe('postgresql://worker-2')
    expect(mocks.inject).toHaveBeenCalledWith('__typedPgVitestDatabaseUrls')
    expect(mocks.beforeEach).toHaveBeenCalledTimes(1)
    expect(registeredBeforeEach).toBeTypeOf('function')

    await registeredBeforeEach?.()

    expect(mocks.getClients).toHaveBeenCalledTimes(1)
    expect(mocks.createTestingPostgres).toHaveBeenCalledWith('postgresql://worker-2')
    expect(mocks.resetTestingDatabase).toHaveBeenCalledWith(sql, ['typed_pg_migrations'])
    expect(mocks.end).toHaveBeenCalledTimes(1)
  })

  it('closes cached typed-pg clients before resetting the database', async () => {
    const firstClient = {
      quit: vi.fn<AsyncVoidMock>(async () => undefined),
    }
    const secondClient = {
      quit: vi.fn<AsyncVoidMock>(async () => undefined),
    }

    await loadSetupModule({
      clients: [firstClient, secondClient],
      databaseUrls: {
        '1': 'postgresql://worker-1',
      },
    })

    await registeredBeforeEach?.()

    expect(firstClient.quit).toHaveBeenCalledTimes(1)
    expect(secondClient.quit).toHaveBeenCalledTimes(1)
  })

  it('still closes the sql client when the reset hook fails', async () => {
    const error = Error('reset failed')

    const { mocks } = await loadSetupModule({
      databaseUrls: {
        '1': 'postgresql://worker-1',
      },
      resetImplementation: async () => Promise.reject(error),
    })

    await expect(registeredBeforeEach?.()).rejects.toThrowError('reset failed')

    expect(mocks.end).toHaveBeenCalledTimes(1)
  })

  it('throws when the plugin did not provide any database urls', async () => {
    await expect(loadSetupModule({})).rejects.toThrowError(/did not provide a testing database URL/)
    expect(registeredBeforeEach).toBeUndefined()
  })
})
