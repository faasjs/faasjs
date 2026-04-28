import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  availableParallelism: vi.fn<() => number>(),
}))

vi.mock('node:os', () => ({
  availableParallelism: mocks.availableParallelism,
}))

describe('resolveVitestWorkerCount', () => {
  const originalVitestMaxWorkers = process.env.VITEST_MAX_WORKERS

  beforeEach(() => {
    vi.resetModules()
    mocks.availableParallelism.mockReturnValue(8)
    delete process.env.VITEST_MAX_WORKERS
  })

  afterEach(() => {
    if (typeof originalVitestMaxWorkers === 'string')
      process.env.VITEST_MAX_WORKERS = originalVitestMaxWorkers
    else delete process.env.VITEST_MAX_WORKERS
  })

  it('prefers an explicit maxWorkers value', async () => {
    const { resolveVitestWorkerCount } = await import('../../vitest-worker-count')

    expect(
      resolveVitestWorkerCount({
        config: {
          maxWorkers: 3,
        },
        vitest: {
          config: {},
        },
      } as never),
    ).toBe(3)
  })

  it('uses Vitest defaults when maxWorkers is omitted', async () => {
    const { resolveVitestWorkerCount } = await import('../../vitest-worker-count')

    expect(
      resolveVitestWorkerCount({
        config: {},
        vitest: {
          config: {},
        },
      } as never),
    ).toBe(7)
  })

  it('halves the worker count in watch mode', async () => {
    const { resolveVitestWorkerCount } = await import('../../vitest-worker-count')

    expect(
      resolveVitestWorkerCount({
        config: {},
        vitest: {
          config: {
            watch: true,
          },
        },
      } as never),
    ).toBe(4)
  })

  it('accepts percentage-based worker counts from the environment', async () => {
    process.env.VITEST_MAX_WORKERS = '50%'

    const { resolveVitestWorkerCount } = await import('../../vitest-worker-count')

    expect(
      resolveVitestWorkerCount({
        config: {},
        vitest: {
          config: {},
        },
      } as never),
    ).toBe(4)
  })
})
