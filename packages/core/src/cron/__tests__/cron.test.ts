import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest'

import {
  createCronJob,
  CronJob,
  listCronJobs,
  mountServerCronJobs,
  removeCronJob,
  unmountServerCronJobs,
} from '../..'

describe('cron', () => {
  let warnSpy: MockInstance

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  afterEach(() => {
    for (const cronJob of listCronJobs()) removeCronJob(cronJob)

    vi.clearAllTimers()
    vi.useRealTimers()
    warnSpy.mockRestore()
  })

  it('should list jobs in registration order and remove jobs', () => {
    const startIndex = listCronJobs().length

    const first = createCronJob({
      name: 'list-job-1',
      expression: '* * * * *',
      handler: async () => {},
    })
    const second = createCronJob({
      name: 'list-job-2',
      expression: '* * * * *',
      handler: async () => {},
    })

    expect(listCronJobs().slice(startIndex)).toEqual([first, second])

    expect(removeCronJob(first)).toEqual(true)
    expect(removeCronJob(first)).toEqual(false)
    expect(listCronJobs()).not.toContain(first)
    expect(listCronJobs()).toContain(second)
  })

  it('should validate expression', () => {
    expect(
      () =>
        new CronJob({
          expression: '* * * *',
          handler: async () => {},
        }),
    ).toThrow(/Expected 5 fields/)

    expect(
      () =>
        new CronJob({
          expression: '1-5 * * * *',
          handler: async () => {},
        }),
    ).toThrow(/Invalid minute segment/)

    expect(
      () =>
        new CronJob({
          expression: '* * * * 7',
          handler: async () => {},
        }),
    ).toThrow(/dayOfWeek value out of range/)
  })

  it('should run on minute boundary', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:10.000Z'))

    const triggeredAt: string[] = []

    const cronJob = new CronJob({
      name: 'every-minute',
      expression: '* * * * *',
      handler: ({ now }) => {
        triggeredAt.push(now.toISOString())
      },
    })

    cronJob.start()

    expect(triggeredAt).toHaveLength(0)

    await vi.advanceTimersByTimeAsync(50_000)

    expect(triggeredAt).toHaveLength(1)
    expect(triggeredAt[0]).toEqual('2026-01-01T00:01:00.000Z')

    await vi.advanceTimersByTimeAsync(60_000)

    expect(triggeredAt).toHaveLength(2)

    cronJob.stop()
  })

  it('should support step syntax', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:04:30.000Z'))

    const minutes: number[] = []

    const cronJob = new CronJob({
      expression: '*/5 * * * *',
      handler: ({ now }) => {
        minutes.push(now.getMinutes())
      },
    })

    cronJob.start()

    await vi.advanceTimersByTimeAsync(30_000)

    expect(minutes).toEqual([5])

    await vi.advanceTimersByTimeAsync(60_000)

    expect(minutes).toEqual([5])

    cronJob.stop()
  })

  it('should stop scheduling after stop()', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:10.000Z'))

    let times = 0

    const cronJob = new CronJob({
      expression: '* * * * *',
      handler: async () => {
        times++
      },
    })

    cronJob.start()
    cronJob.stop()

    await vi.advanceTimersByTimeAsync(180_000)

    expect(times).toEqual(0)
  })

  it('should allow concurrent executions', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))

    let active = 0
    let maxActive = 0

    const cronJob = new CronJob({
      expression: '* * * * *',
      handler: async () => {
        active++
        maxActive = Math.max(maxActive, active)

        await new Promise((resolve) => setTimeout(resolve, 120_000))

        active--
      },
    })

    cronJob.start()

    await vi.advanceTimersByTimeAsync(120_000)

    expect(maxActive).toBeGreaterThanOrEqual(2)

    cronJob.stop()

    await vi.runOnlyPendingTimersAsync()
  })

  it('should call onError when handler throws', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))

    const errors: string[] = []

    const cronJob = new CronJob({
      expression: '* * * * *',
      handler: async () => {
        throw Error('cron-failed')
      },
      onError: async (error) => {
        errors.push(error.message)
      },
    })

    cronJob.start()

    await vi.advanceTimersByTimeAsync(60_000)

    expect(errors).toEqual(['cron-failed'])

    cronJob.stop()
  })

  it('should normalize non-Error throws and ignore missing onError handlers', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))

    const logger = {
      debug: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    } as any

    const cronJob = new CronJob({
      expression: '* * * * *',
      logger,
      handler: async () => {
        throw 'plain failure'
      },
    })

    cronJob.start()

    await vi.advanceTimersByTimeAsync(60_000)

    expect(logger.error).toHaveBeenCalled()
    expect(logger.error.mock.calls[0][0]).toBeInstanceOf(Error)
    expect(logger.error.mock.calls[0][0].message).toBe('plain failure')

    cronJob.stop()
  })

  it('should guard repeated starts, no-op stops, and manual tick helpers', async () => {
    const logger = {
      debug: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    } as any

    const cronJob = new CronJob({
      expression: '* * * * *',
      logger,
      handler: async () => {},
    })

    cronJob.stop()
    expect(cronJob.isStarted).toBe(false)

    cronJob.start()
    cronJob.start()
    expect(logger.warn).toHaveBeenCalledWith('start() has been called, skipped.')

    cronJob.stop()

    ;(cronJob as any).scheduleNext()
    ;(cronJob as any).tick()

    expect(cronJob.isStarted).toBe(false)
  })

  it('should skip duplicate ticks in the same minute', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))

    const handler = vi.fn()
    const cronJob = new CronJob({
      expression: '* * * * *',
      handler,
    })

    cronJob.start()

    ;(cronJob as any).tick()
    await Promise.resolve()

    vi.setSystemTime(new Date('2026-01-01T00:00:30.000Z'))
    ;(cronJob as any).tick()
    await Promise.resolve()

    expect(handler).toHaveBeenCalledTimes(1)

    cronJob.stop()
  })

  it('should validate empty and invalid step expressions', () => {
    expect(
      () =>
        new CronJob({
          expression: '',
          handler: async () => {},
        }),
    ).toThrow('[CronJob] expression is required.')

    expect(
      () =>
        new CronJob({
          expression: '*/0 * * * *',
          handler: async () => {},
        }),
    ).toThrow('Invalid minute segment')
  })

  it('should mount and unmount registered jobs only on outer server transitions', () => {
    const startSpy = vi.spyOn(CronJob.prototype, 'start')
    const stopSpy = vi.spyOn(CronJob.prototype, 'stop')

    const cronJob = createCronJob({
      name: 'registry-job',
      expression: '* * * * *',
      handler: async () => {},
    })

    mountServerCronJobs()
    mountServerCronJobs()

    expect(startSpy).toHaveBeenCalledTimes(1)
    expect(listCronJobs()).toContain(cronJob)

    unmountServerCronJobs()
    expect(stopSpy).toHaveBeenCalledTimes(0)

    unmountServerCronJobs()
    expect(stopSpy).toHaveBeenCalledTimes(1)

    startSpy.mockRestore()
    stopSpy.mockRestore()
  })
})
