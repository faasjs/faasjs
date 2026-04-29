import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PG_VITEST_DATABASE_URLS_KEY } from '../../../../pg-dev/src/plugin-context'

const mocks = vi.hoisted(() => ({
  resolveVitestWorkerCount: vi.fn<() => number>(),
  startPGliteServer: vi.fn<() => Promise<{ databaseUrl: string; stop: () => Promise<void> }>>(),
}))

vi.mock('../../../../pg-dev/src/pglite', () => ({
  startPGliteServer: mocks.startPGliteServer,
}))

vi.mock('../../../../pg-dev/src/vitest-worker-count', () => ({
  resolveVitestWorkerCount: mocks.resolveVitestWorkerCount,
}))

function createTestingServer(databaseUrl: string) {
  let stopCalls = 0

  return {
    databaseUrl,
    get stopCalls() {
      return stopCalls
    },
    async stop() {
      stopCalls += 1
    },
  }
}

function createProject() {
  const provided: Array<[string, unknown]> = []

  return {
    project: {
      config: {},
      provide(key: string, value: unknown) {
        provided.push([key, value])
      },
      vitest: {
        config: {},
      },
    },
    provided,
  }
}

describe('faasjs-pg test global setup', () => {
  beforeEach(() => {
    mocks.resolveVitestWorkerCount.mockReset()
    mocks.startPGliteServer.mockReset()
    vi.resetModules()
    mocks.resolveVitestWorkerCount.mockReturnValue(1)
  })

  it('creates one temporary database per resolved worker and tears them down', async () => {
    const workerOneServer = createTestingServer('postgresql://worker-1')
    const workerTwoServer = createTestingServer('postgresql://worker-2')
    const { project, provided } = createProject()

    mocks.resolveVitestWorkerCount.mockReturnValueOnce(2)
    mocks.startPGliteServer
      .mockResolvedValueOnce(workerOneServer)
      .mockResolvedValueOnce(workerTwoServer)

    const module = await import('../global-setup')
    const teardown = await module.default(project as never)

    expect(provided).toEqual([
      [
        PG_VITEST_DATABASE_URLS_KEY,
        {
          '1': workerOneServer.databaseUrl,
          '2': workerTwoServer.databaseUrl,
        },
      ],
    ])

    await teardown()

    expect(workerOneServer.stopCalls).toBe(1)
    expect(workerTwoServer.stopCalls).toBe(1)
  })

  it('stops already started databases when a later worker fails to boot', async () => {
    const workerOneServer = createTestingServer('postgresql://worker-1')
    const { project, provided } = createProject()

    mocks.resolveVitestWorkerCount.mockReturnValueOnce(2)
    mocks.startPGliteServer
      .mockResolvedValueOnce(workerOneServer)
      .mockRejectedValueOnce(Error('start failed'))

    const module = await import('../global-setup')

    await expect(module.default(project as never)).rejects.toThrowError('start failed')
    expect(workerOneServer.stopCalls).toBe(1)
    expect(provided).toEqual([])
  })
})
