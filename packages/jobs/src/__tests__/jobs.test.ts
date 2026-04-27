import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { Logger } from '@faasjs/node-utils'
import { getClient, getClients, type Client } from '@faasjs/pg'
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest'

import { getJobPathFromFile, loadJobRegistry } from '../discovery'
import { enqueueJob, JobScheduler, JobWorker, type JobRecord } from '../index'
import { ensureJobsSchema } from '../queue'

const root = resolve(__dirname, 'fixtures/src')
const tempDirs: string[] = []

describe('jobs', () => {
  let client: Client

  beforeEach(async () => {
    client = await getClient()
    await ensureJobsSchema(client)
    await client.raw`
      CREATE TABLE IF NOT EXISTS job_events (
        id serial PRIMARY KEY,
        job_id uuid NOT NULL,
        message text NOT NULL,
        attempt integer NOT NULL,
        created_at timestamptz NOT NULL DEFAULT NOW()
      )
    `
    await client.raw`TRUNCATE faasjs_jobs, job_events`
  })

  afterEach(async () => {
    await Promise.all(
      tempDirs.splice(0).map((path) =>
        rm(path, {
          recursive: true,
          force: true,
        }),
      ),
    )
  })

  afterAll(async () => {
    await Promise.allSettled(getClients().map((cachedClient) => cachedClient.quit()))
  })

  it('enqueues jobs and reuses idempotency keys', async () => {
    const runAt = new Date('2026-01-01T00:00:00.000Z')
    const first = await enqueueJob(
      'jobs/success',
      {
        message: 'hello',
      },
      {
        idempotencyKey: 'jobs/success:hello',
        maxAttempts: 5,
        priority: 10,
        runAt,
      },
    )
    const second = await enqueueJob(
      'jobs/success',
      {
        message: 'ignored',
      },
      {
        idempotencyKey: 'jobs/success:hello',
      },
    )

    expect(second.id).toEqual(first.id)

    const rows = await client.raw<JobRecord>`SELECT * FROM faasjs_jobs`

    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      job_path: 'jobs/success',
      queue: 'default',
      params: {
        message: 'hello',
      },
      priority: 10,
      max_attempts: 5,
      status: 'pending',
    })
  })

  it('records the internal jobs schema migration version', async () => {
    const migrations = await client.raw<{
      version: number
      name: string
    }>`SELECT version, name FROM faasjs_jobs_schema_migrations ORDER BY version`

    expect(migrations).toEqual([
      {
        version: 1,
        name: 'create_faasjs_jobs',
      },
    ])
  })

  it('rejects explicit invalid queue and max attempts values', async () => {
    await expect(enqueueJob('jobs/success', {}, { queue: '' })).rejects.toThrow(
      'queue must not be empty',
    )
    await expect(enqueueJob('jobs/success', {}, { maxAttempts: 0 })).rejects.toThrow(
      'maxAttempts must be a positive integer',
    )
    expect(() => new JobWorker(new Map(), { queue: '' })).toThrow('queue must not be empty')

    const registry = await loadJobRegistry({ root })
    const cronJob = registry.get('jobs/cron')

    if (!cronJob) throw Error('jobs/cron fixture is missing')

    cronJob.cron[0].queue = ''

    const scheduler = new JobScheduler(registry)

    await expect(scheduler.tick(new Date('2026-01-01T00:00:00.000Z'))).rejects.toThrow(
      'queue must not be empty',
    )

    delete cronJob.cron[0].queue
    cronJob.cron[0].maxAttempts = 0

    await expect(scheduler.tick(new Date('2026-01-01T00:00:00.000Z'))).rejects.toThrow(
      'maxAttempts must be a positive integer',
    )

    delete cronJob.cron[0].maxAttempts
  })

  it('logs background worker and scheduler loop errors', async () => {
    const logs: string[] = []
    const logger = new Logger('@faasjs/jobs-test')

    logger.disableTransport = true
    logger.stdout = (message) => logs.push(message)
    logger.stderr = (message) => logs.push(message)

    const worker = new JobWorker(new Map(), {
      logger,
      pollInterval: 1,
    })

    worker.poll = async () => {
      throw Error('poll failed')
    }

    worker.start()
    await new Promise((resolve) => setTimeout(resolve, 10))
    await worker.stop()

    expect(logs.some((message) => message.includes('poll failed'))).toEqual(true)

    logs.length = 0

    const scheduler = new JobScheduler(new Map(), {
      logger,
      pollInterval: 1,
    })

    scheduler.tick = async () => {
      throw Error('tick failed')
    }

    scheduler.start()
    await new Promise((resolve) => setTimeout(resolve, 10))
    await scheduler.stop()

    expect(logs.some((message) => message.includes('tick failed'))).toEqual(true)
  })

  it('discovers job paths from .job.ts files', () => {
    expect(getJobPathFromFile(resolve(root, 'jobs/success.job.ts'), root)).toEqual('jobs/success')
    expect(getJobPathFromFile(resolve(root, 'jobs/reports/index.job.ts'), root)).toEqual(
      'jobs/reports',
    )
  })

  it('loads job files with project tsconfig path aliases', async () => {
    const projectRoot = await mkdtemp(join(tmpdir(), 'faas-jobs-alias-'))
    tempDirs.push(projectRoot)

    await mkdir(join(projectRoot, 'src', 'shared'), {
      recursive: true,
    })
    await mkdir(join(projectRoot, 'src', 'jobs'), {
      recursive: true,
    })
    await writeFile(
      join(projectRoot, 'tsconfig.json'),
      JSON.stringify(
        {
          compilerOptions: {
            baseUrl: '.',
            paths: {
              '@/*': ['src/*'],
            },
          },
        },
        null,
        2,
      ),
      'utf8',
    )
    await writeFile(
      join(projectRoot, 'src', 'shared', 'queue.ts'),
      "export const queue = 'alias'\n",
    )
    await writeFile(
      join(projectRoot, 'src', 'jobs', 'alias.job.ts'),
      `import { defineJob } from ${JSON.stringify(pathToFileURL(resolve(__dirname, '..', 'index.ts')).href)}
import { queue } from '@/shared/queue'

export default defineJob({
  queue,
  async handler() {},
})
`,
      'utf8',
    )

    const registry = await loadJobRegistry({
      root: join(projectRoot, 'src'),
    })

    expect(registry.get('jobs/alias')?.queue).toEqual('alias')
  })

  it('runs a pending job with validated params', async () => {
    const record = await enqueueJob('jobs/success', {
      message: 'processed',
    })
    const worker = new JobWorker(await loadJobRegistry({ root }))

    expect(worker.jobs.has('jobs/success')).toEqual(true)
    expect(await worker.poll()).toEqual(1)

    const events = await client.raw<{
      job_id: string
      message: string
      attempt: number
    }>`SELECT job_id, message, attempt FROM job_events`
    const [updated] = await client.raw<JobRecord>`SELECT * FROM faasjs_jobs WHERE id = ${record.id}`

    expect(events).toEqual([
      {
        job_id: record.id,
        message: 'processed',
        attempt: 1,
      },
    ])
    expect(updated).toMatchObject({
      status: 'completed',
      attempts: 1,
    })

    await worker.stop()
  })

  it('retries and then fails jobs after max attempts', async () => {
    const record = await enqueueJob(
      'jobs/retry',
      {
        message: 'boom',
      },
      {
        maxAttempts: 2,
      },
    )
    const worker = new JobWorker(await loadJobRegistry({ root }))

    expect(await worker.poll()).toEqual(1)

    const [firstAttempt] =
      await client.raw<JobRecord>`SELECT * FROM faasjs_jobs WHERE id = ${record.id}`

    expect(firstAttempt).toMatchObject({
      attempts: 1,
      status: 'pending',
    })
    expect(firstAttempt.last_error).toContain('boom 1')

    expect(await worker.poll()).toEqual(1)

    const [secondAttempt] =
      await client.raw<JobRecord>`SELECT * FROM faasjs_jobs WHERE id = ${record.id}`

    expect(secondAttempt).toMatchObject({
      attempts: 2,
      status: 'failed',
    })
    expect(secondAttempt.last_error).toContain('boom 2')

    await worker.stop()
  })

  it('records a missing job handler as a job failure', async () => {
    const record = await enqueueJob('jobs/missing', {}, { maxAttempts: 1 })
    const worker = new JobWorker(await loadJobRegistry({ root }))

    expect(await worker.poll()).toEqual(1)

    const [updated] = await client.raw<JobRecord>`SELECT * FROM faasjs_jobs WHERE id = ${record.id}`

    expect(updated.status).toEqual('failed')
    expect(updated.last_error).toContain('Missing .job.ts handler')

    await worker.stop()
  })

  it('deduplicates scheduler cron enqueue attempts', async () => {
    const scheduler = new JobScheduler(await loadJobRegistry({ root }))
    const scheduledAt = new Date('2026-01-01T00:00:00.000Z')

    await scheduler.tick(scheduledAt)
    await scheduler.tick(scheduledAt)

    const rows = await client.raw<JobRecord>`
      SELECT * FROM faasjs_jobs
      WHERE job_path = 'jobs/cron'
    `

    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      job_path: 'jobs/cron',
      params: {
        message: 'from cron',
      },
      status: 'pending',
    })
    expect(rows[0].cron_key).toBeTruthy()
    expect(rows[0].scheduled_at).toBeTruthy()

    await scheduler.stop()
  })
})
