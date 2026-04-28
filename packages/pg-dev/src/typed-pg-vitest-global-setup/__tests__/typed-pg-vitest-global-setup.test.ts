import { beforeEach, describe, expect, it, vi } from 'vitest'

type AsyncVoidMock = () => Promise<void>
type ProvideMock = (key: string, value: Record<string, string>) => void

type ClientLike = {
  quit: ReturnType<typeof vi.fn>
}

const mocks = vi.hoisted(() => ({
  existsSync: vi.fn<(path: string) => boolean>(),
  globSync: vi.fn<(pattern: string) => string[]>(),
  startPGliteServer: vi.fn<() => Promise<{ databaseUrl: string; stop: () => Promise<void> }>>(),
  createClient:
    vi.fn<(databaseUrl: string, options?: { max?: number; ssl?: boolean }) => ClientLike>(),
  resolveVitestWorkerCount: vi.fn<() => number>(),
  migratorConstructor: vi.fn<(options: { client: ClientLike; folder: string }) => void>(),
  migratorMigrate: vi.fn<() => Promise<void>>(),
}))

vi.mock('node:fs', () => ({
  existsSync: mocks.existsSync,
  globSync: mocks.globSync,
}))

vi.mock('../../pglite', () => ({
  startPGliteServer: mocks.startPGliteServer,
}))

vi.mock('../../vitest-worker-count', () => ({
  resolveVitestWorkerCount: mocks.resolveVitestWorkerCount,
}))

vi.mock('@faasjs/pg', () => ({
  Migrator: function Migrator(options: { client: ClientLike; folder: string }) {
    mocks.migratorConstructor(options)
    return {
      migrate: mocks.migratorMigrate,
    }
  },
  createClient: mocks.createClient,
}))

function createTestingServer(databaseUrl: string) {
  return {
    databaseUrl,
    stop: vi.fn<AsyncVoidMock>(async () => undefined),
  }
}

describe('typed-pg-vitest global setup', () => {
  let clients: ClientLike[]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()

    clients = []

    mocks.existsSync.mockReturnValue(false)
    mocks.globSync.mockReturnValue([])
    mocks.resolveVitestWorkerCount.mockReturnValue(1)
    mocks.createClient.mockImplementation(() => {
      const client = {
        quit: vi.fn<AsyncVoidMock>(async () => undefined),
      }

      clients.push(client)
      return client
    })
    mocks.migratorMigrate.mockResolvedValue(undefined)
  })

  it('creates one temporary database per worker and tears them all down', async () => {
    const workerOneServer = createTestingServer('postgresql://worker-1')
    const workerTwoServer = createTestingServer('postgresql://worker-2')
    const provide = vi.fn<ProvideMock>()
    const project = {
      config: {
        maxWorkers: 2,
        root: '/repo',
      },
      provide,
    }

    mocks.resolveVitestWorkerCount.mockReturnValueOnce(2)
    mocks.existsSync.mockReturnValue(true)
    mocks.globSync.mockReturnValue([
      '/repo/migrations/20250101000000_first.ts',
      '/repo/migrations/20250102000000_second.ts',
    ])
    mocks.startPGliteServer
      .mockResolvedValueOnce(workerOneServer)
      .mockResolvedValueOnce(workerTwoServer)

    const { default: setup } = await import('../../typed-pg-vitest-global-setup')
    const teardown = await setup(project as never)

    expect(mocks.createClient).toHaveBeenNthCalledWith(1, workerOneServer.databaseUrl, {
      max: 1,
      ssl: false,
    })
    expect(mocks.createClient).toHaveBeenNthCalledWith(2, workerTwoServer.databaseUrl, {
      max: 1,
      ssl: false,
    })
    expect(mocks.migratorConstructor).toHaveBeenNthCalledWith(1, {
      client: clients[0],
      folder: '/repo/migrations',
    })
    expect(mocks.migratorConstructor).toHaveBeenNthCalledWith(2, {
      client: clients[1],
      folder: '/repo/migrations',
    })
    expect(mocks.migratorMigrate).toHaveBeenCalledTimes(2)
    expect(clients).toHaveLength(2)
    expect(clients[0].quit).toHaveBeenCalledTimes(1)
    expect(clients[1].quit).toHaveBeenCalledTimes(1)
    expect(provide).toHaveBeenCalledWith('__typedPgVitestDatabaseUrls', {
      '1': workerOneServer.databaseUrl,
      '2': workerTwoServer.databaseUrl,
    })

    await teardown()

    expect(workerOneServer.stop).toHaveBeenCalledTimes(1)
    expect(workerTwoServer.stop).toHaveBeenCalledTimes(1)
  })

  it('uses a single worker database when the resolved worker count is one', async () => {
    const workerServer = createTestingServer('postgresql://worker-1')
    const provide = vi.fn<ProvideMock>()
    const project = {
      config: {
        root: '/repo',
      },
      provide,
    }

    mocks.startPGliteServer.mockResolvedValueOnce(workerServer)

    const { default: setup } = await import('../../typed-pg-vitest-global-setup')
    const teardown = await setup(project as never)

    expect(mocks.createClient).not.toHaveBeenCalled()
    expect(mocks.migratorConstructor).not.toHaveBeenCalled()
    expect(provide).toHaveBeenCalledWith('__typedPgVitestDatabaseUrls', {
      '1': workerServer.databaseUrl,
    })

    await teardown()

    expect(workerServer.stop).toHaveBeenCalledTimes(1)
  })

  it('stops the worker server when migrations fail', async () => {
    const workerServer = createTestingServer('postgresql://worker-1')
    const project = {
      config: {
        maxWorkers: 1,
        root: '/repo',
      },
      provide: vi.fn<ProvideMock>(),
    }

    mocks.existsSync.mockReturnValue(true)
    mocks.globSync.mockReturnValue(['/repo/migrations/20250101000000_invalid.ts'])
    mocks.startPGliteServer.mockResolvedValueOnce(workerServer)
    mocks.migratorMigrate.mockRejectedValueOnce(Error('migrate failed'))

    const { default: setup } = await import('../../typed-pg-vitest-global-setup')

    await expect(setup(project as never)).rejects.toThrowError('migrate failed')

    expect(workerServer.stop).toHaveBeenCalledTimes(1)
    expect(project.provide).not.toHaveBeenCalled()
    expect(clients).toHaveLength(1)
    expect(clients[0].quit).toHaveBeenCalledTimes(1)
  })

  it('stops previously started servers when a later worker fails to start', async () => {
    const workerOneServer = createTestingServer('postgresql://worker-1')
    const project = {
      config: {
        maxWorkers: 2,
        root: '/repo',
      },
      provide: vi.fn<ProvideMock>(),
    }

    mocks.resolveVitestWorkerCount.mockReturnValueOnce(2)
    mocks.startPGliteServer
      .mockResolvedValueOnce(workerOneServer)
      .mockRejectedValueOnce(Error('start failed'))

    const { default: setup } = await import('../../typed-pg-vitest-global-setup')

    await expect(setup(project as never)).rejects.toThrowError('start failed')

    expect(workerOneServer.stop).toHaveBeenCalledTimes(1)
    expect(mocks.createClient).not.toHaveBeenCalled()
    expect(project.provide).not.toHaveBeenCalled()
  })
})
