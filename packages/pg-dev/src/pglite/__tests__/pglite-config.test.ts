import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('pglite max connections', () => {
  const originalPoolMax = process.env.PG_POOL_MAX

  beforeEach(() => {
    vi.resetModules()
    delete process.env.PG_POOL_MAX
  })

  afterEach(() => {
    if (typeof originalPoolMax === 'string') process.env.PG_POOL_MAX = originalPoolMax
    else delete process.env.PG_POOL_MAX

    vi.restoreAllMocks()
    vi.doUnmock('@electric-sql/pglite')
    vi.doUnmock('@electric-sql/pglite-socket')
  })

  async function loadPgliteModule() {
    const close = vi.fn<() => Promise<void>>(async () => undefined)
    const start = vi.fn<() => Promise<void>>(async () => undefined)
    const stop = vi.fn<() => Promise<void>>(async () => undefined)
    const getServerConn = vi.fn(() => '127.0.0.1:5432')
    const create = vi.fn(async () => ({ close }))
    const PGLiteSocketServer = vi.fn().mockImplementation(function MockPGLiteSocketServer() {
      return {
        getServerConn,
        start,
        stop,
      }
    })

    vi.doMock('@electric-sql/pglite', () => ({
      PGlite: {
        create,
      },
    }))
    vi.doMock('@electric-sql/pglite-socket', () => ({
      PGLiteSocketServer,
    }))

    const module = await import('../../pglite')

    return {
      ...module,
      mocks: {
        PGLiteSocketServer,
        close,
        create,
        getServerConn,
        start,
        stop,
      },
    }
  }

  it('uses the default max connections when PG_POOL_MAX is unset', async () => {
    const { mocks, startPGliteServer } = await loadPgliteModule()
    const server = await startPGliteServer()

    expect(mocks.PGLiteSocketServer).toHaveBeenCalledWith(
      expect.objectContaining({
        host: '127.0.0.1',
        maxConnections: 10,
        port: 0,
      }),
    )

    await server.stop()
  })

  it('reads max connections from PG_POOL_MAX', async () => {
    process.env.PG_POOL_MAX = '23'

    const { mocks, startPGliteServer } = await loadPgliteModule()
    const server = await startPGliteServer()

    expect(mocks.PGLiteSocketServer).toHaveBeenCalledWith(
      expect.objectContaining({
        maxConnections: 23,
      }),
    )

    await server.stop()
  })

  it('throws when PG_POOL_MAX is invalid', async () => {
    process.env.PG_POOL_MAX = 'abc'

    const { mocks, startPGliteServer } = await loadPgliteModule()

    await expect(startPGliteServer()).rejects.toThrowError('PG_POOL_MAX must be a positive integer')
    expect(mocks.create).not.toHaveBeenCalled()
    expect(mocks.PGLiteSocketServer).not.toHaveBeenCalled()
  })
})
