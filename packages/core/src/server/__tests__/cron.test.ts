import { once } from 'node:events'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { createCronJob, listCronJobs, removeCronJob } from '../../index'
import { Server } from '../../server'

async function listenServer(server: Server): Promise<void> {
  const httpServer = server.listen()

  if (httpServer.listening) return

  await once(httpServer, 'listening')
}

describe('server/cron', () => {
  const poolId = Number(process.env.VITEST_POOL_ID || 0)

  afterEach(() => {
    for (const cronJob of listCronJobs()) removeCronJob(cronJob)
  })

  it('should ignore cronJobs option for compatibility', () => {
    expect(
      () =>
        new Server(join(__dirname, 'funcs'), {
          cronJobs: [],
        } as any),
    ).not.toThrow()
  })

  it('should start and stop registered cron jobs with server lifecycle', async () => {
    const cronJob = createCronJob({
      name: 'server-boot-job',
      expression: '* * * * *',
      handler: async () => {},
    })

    expect(cronJob.isStarted).toEqual(false)

    const server = new Server(join(__dirname, 'funcs'), {
      port: 31901 + poolId,
    })

    await listenServer(server)

    expect(cronJob.isStarted).toEqual(true)

    await server.close()

    expect(cronJob.isStarted).toEqual(false)
  })

  it('should auto start new cron jobs after server has started', async () => {
    const server = new Server(join(__dirname, 'funcs'), {
      port: 31902 + poolId,
    })

    await listenServer(server)

    const cronJob = createCronJob({
      name: 'runtime-added-job',
      expression: '* * * * *',
      handler: async () => {},
    })

    expect(cronJob.isStarted).toEqual(true)

    await server.close()

    expect(cronJob.isStarted).toEqual(false)
  })

  it('should stop cron job when removed after server started', async () => {
    const server = new Server(join(__dirname, 'funcs'), {
      port: 31903 + poolId,
    })

    await listenServer(server)

    const cronJob = createCronJob({
      name: 'runtime-removed-job',
      expression: '* * * * *',
      handler: async () => {},
    })

    expect(cronJob.isStarted).toEqual(true)
    expect(removeCronJob(cronJob)).toEqual(true)
    expect(cronJob.isStarted).toEqual(false)
    expect(listCronJobs()).not.toContain(cronJob)
    expect(removeCronJob(cronJob)).toEqual(false)

    await server.close()
  })

  it('should not mount cron jobs when cronJob option is false', async () => {
    const cronJob = createCronJob({
      name: 'server-no-cron-job',
      expression: '* * * * *',
      handler: async () => {},
    })

    const server = new Server(join(__dirname, 'funcs'), {
      port: 31904 + poolId,
      cronJob: false,
    })

    await listenServer(server)

    expect(cronJob.isStarted).toEqual(false)

    await server.close()

    expect(cronJob.isStarted).toEqual(false)
  })

  it('should not auto start runtime cron jobs when cronJob option is false', async () => {
    const server = new Server(join(__dirname, 'funcs'), {
      port: 31905 + poolId,
      cronJob: false,
    })

    await listenServer(server)

    const cronJob = createCronJob({
      name: 'runtime-no-cron-job',
      expression: '* * * * *',
      handler: async () => {},
    })

    expect(cronJob.isStarted).toEqual(false)

    await server.close()
  })
})
