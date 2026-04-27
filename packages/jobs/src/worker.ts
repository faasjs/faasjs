import { randomUUID } from 'node:crypto'

import { Logger } from '@faasjs/node-utils'
import { getClient, type Client } from '@faasjs/pg'

import { type Job } from './define_job'
import { loadJobRegistry, type JobRegistry, type LoadJobRegistryOptions } from './discovery'
import { resolvePositiveInteger, resolveQueue } from './options'
import { ensureJobsSchema } from './queue'
import type { JobRecord, JobRetry } from './types'

export type JobWorkerOptions = LoadJobRegistryOptions & {
  queue?: string
  concurrency?: number
  pollInterval?: number
  leaseSeconds?: number
  workerId?: string
  autoStart?: boolean
}

async function resolveRetryRunAt(
  retry: JobRetry | undefined,
  error: Error,
  record: JobRecord,
): Promise<Date> {
  const attempt = record.attempts

  if (typeof retry === 'function') {
    const value = await retry({
      error,
      job: record,
      attempt,
    })

    return value instanceof Date ? value : new Date(Date.now() + value)
  }

  if (typeof retry === 'number') return new Date(Date.now() + retry)

  const delay = retry?.delay ?? 30_000
  const multiplier = retry?.multiplier ?? 2
  const maxDelay = retry?.maxDelay ?? 300_000
  const nextDelay = Math.min(delay * multiplier ** Math.max(0, attempt - 1), maxDelay)

  return new Date(Date.now() + nextDelay)
}

export class JobWorker {
  public readonly queue: string
  public readonly concurrency: number
  public readonly pollInterval: number
  public readonly leaseSeconds: number
  public readonly workerId: string
  public readonly jobs: JobRegistry
  public readonly logger: Logger

  private active = false
  private polling = false
  private timer: NodeJS.Timeout | undefined
  private currentPoll: Promise<number> | undefined

  constructor(jobs: JobRegistry, options: JobWorkerOptions = {}) {
    this.jobs = jobs
    this.queue = resolveQueue(options.queue)
    this.concurrency = resolvePositiveInteger(options.concurrency, 1, 'concurrency')
    this.pollInterval = resolvePositiveInteger(options.pollInterval, 1000, 'pollInterval')
    this.leaseSeconds = resolvePositiveInteger(options.leaseSeconds, 60, 'leaseSeconds')
    this.workerId = options.workerId || `worker-${randomUUID()}`
    this.logger = options.logger || new Logger('@faasjs/jobs')
  }

  public start(): this {
    if (this.active) return this

    this.active = true
    this.schedule(0)

    return this
  }

  public async stop(): Promise<void> {
    this.active = false

    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = undefined
    }

    if (this.currentPoll) await this.currentPoll
  }

  private schedule(delay: number): void {
    if (!this.active) return

    this.timer = setTimeout(() => {
      this.currentPoll = this.poll()
        .catch((error) => {
          this.logger.error(error)

          return 0
        })
        .finally(() => {
          this.currentPoll = undefined
          this.schedule(this.pollInterval)
        })
    }, delay)
  }

  private async claim(client: Client): Promise<JobRecord | undefined> {
    const leaseId = randomUUID()
    const [record] = await client.transaction((trx) =>
      trx.raw<JobRecord>(
        `
          WITH picked AS (
            SELECT id
            FROM faasjs_jobs
            WHERE queue = ?
              AND run_at <= NOW()
              AND (
                status = 'pending'
                OR (status = 'running' AND locked_until < NOW())
              )
            ORDER BY priority DESC, run_at ASC, created_at ASC
            FOR UPDATE SKIP LOCKED
            LIMIT 1
          )
          UPDATE faasjs_jobs
          SET
            status = 'running',
            attempts = attempts + 1,
            locked_by = ?,
            lease_id = ?::uuid,
            locked_until = NOW() + ?::interval,
            updated_at = NOW()
          WHERE id IN (SELECT id FROM picked)
          RETURNING *
        `,
        this.queue,
        this.workerId,
        leaseId,
        `${this.leaseSeconds} seconds`,
      ),
    )

    return record
  }

  private async complete(client: Client, record: JobRecord): Promise<void> {
    await client.raw(
      `
        UPDATE faasjs_jobs
        SET
          status = 'completed',
          locked_by = NULL,
          lease_id = NULL,
          locked_until = NULL,
          updated_at = NOW(),
          completed_at = NOW()
        WHERE id = ?::uuid
          AND lease_id = ?::uuid
      `,
      record.id,
      record.lease_id,
    )
  }

  private async fail(
    client: Client,
    record: JobRecord,
    error: unknown,
    definition?: Job<any, any, any>,
  ): Promise<void> {
    const normalized = error instanceof Error ? error : Error(String(error))
    const errorText = normalized.stack || normalized.message

    if (record.attempts >= record.max_attempts) {
      await client.raw(
        `
          UPDATE faasjs_jobs
          SET
            status = 'failed',
            locked_by = NULL,
            lease_id = NULL,
            locked_until = NULL,
            last_error = ?,
            updated_at = NOW(),
            failed_at = NOW()
          WHERE id = ?::uuid
            AND lease_id = ?::uuid
        `,
        errorText,
        record.id,
        record.lease_id,
      )
      return
    }

    const runAt = await resolveRetryRunAt(definition?.retry, normalized, record)

    await client.raw(
      `
        UPDATE faasjs_jobs
        SET
          status = 'pending',
          run_at = ?,
          locked_by = NULL,
          lease_id = NULL,
          locked_until = NULL,
          last_error = ?,
          updated_at = NOW()
        WHERE id = ?::uuid
          AND lease_id = ?::uuid
      `,
      runAt,
      errorText,
      record.id,
      record.lease_id,
    )
  }

  private async runRecord(client: Client, record: JobRecord): Promise<void> {
    const definition = this.jobs.get(record.job_path)

    if (!definition) {
      await this.fail(
        client,
        record,
        Error(`[jobs] Missing .job.ts handler for job_path "${record.job_path}".`),
      )
      return
    }

    try {
      await definition.export().handler(
        {
          params: record.params,
          client,
          job: record,
          attempt: record.attempts,
        },
        {
          job: record,
          workerId: this.workerId,
        } as any,
      )

      await this.complete(client, record)
    } catch (error) {
      await this.fail(client, record, error, definition)
    }
  }

  public async poll(): Promise<number> {
    if (this.polling) return 0

    this.polling = true

    try {
      const client = await getClient()

      await ensureJobsSchema(client)

      const records: JobRecord[] = []

      for (let index = 0; index < this.concurrency; index += 1) {
        const record = await this.claim(client)

        if (!record) break

        records.push(record)
      }

      await Promise.all(records.map((record) => this.runRecord(client, record)))

      return records.length
    } finally {
      this.polling = false
    }
  }
}

export async function startJobWorker(options: JobWorkerOptions = {}): Promise<JobWorker> {
  const client = await getClient()

  await ensureJobsSchema(client)

  const worker = new JobWorker(await loadJobRegistry(options), options)

  if (options.autoStart !== false) worker.start()

  return worker
}
