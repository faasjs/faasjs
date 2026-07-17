import { randomUUID } from 'node:crypto'

import { Logger } from '@faasjs/node-utils'
import { getClient, type Client } from '@faasjs/pg'

import { type Job } from './define-job'
import { loadJobRegistry, type JobRegistry, type LoadJobRegistryOptions } from './discovery'
import { LoopRunner } from './loop-runner'
import { resolvePositiveInteger, resolveQueue } from './options'
import { ensureJobsSchema } from './queue'
import type { JobRecord, JobRetry } from './types'

const EXPIRED_LEASE_ERROR = '[jobs] Job lease expired after reaching max attempts.'

/**
 * Options for {@link startJobWorker}.
 */
export type JobWorkerOptions = LoadJobRegistryOptions & {
  /** Queue name to poll. Defaults to `'default'`. */
  queue?: string
  /** Number of jobs to claim per poll tick. Defaults to `1`. */
  concurrency?: number
  /** Milliseconds between poll ticks. Defaults to `1000`. */
  pollInterval?: number
  /** Lease duration in seconds before a claimed job can be re-claimed. Defaults to `60`. */
  leaseSeconds?: number
  /** Unique identifier for this worker instance. Auto-generated when omitted. */
  workerId?: string
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

/**
 * Long-running background worker that polls the database for pending jobs,
 * claims them, executes their handlers, and updates their status.
 *
 * Supports configurable concurrency, polling interval, and lease duration.
 * Failed jobs are retried according to their retry strategy until
 * max attempts are reached. Expired leases are reclaimed only while attempts
 * remain; an expired lease at the attempt limit is marked failed.
 * Handler errors are persisted to the job row instead of being thrown from `poll()`.
 *
 * @example
 * const worker = new JobWorker(registry, {
 *   concurrency: 5,
 *   pollInterval: 2000,
 * })
 * worker.start()
 */
export class JobWorker {
  /** Queue name this worker claims from. */
  public readonly queue: string
  /** Maximum number of jobs claimed in each poll. */
  public readonly concurrency: number
  /** Milliseconds between automatic poll ticks. */
  public readonly pollInterval: number
  /** Lease duration in seconds before a running job can be reclaimed. */
  public readonly leaseSeconds: number
  /** Unique worker id written to claimed rows. */
  public readonly workerId: string
  /** Loaded job registry keyed by job path. */
  public readonly jobs: JobRegistry
  /** Worker logger. */
  public readonly logger: Logger

  private polling = false
  private readonly loop: LoopRunner

  constructor(jobs: JobRegistry, options: JobWorkerOptions = {}) {
    this.jobs = jobs
    this.queue = resolveQueue(options.queue)
    this.concurrency = resolvePositiveInteger(options.concurrency, 1, 'concurrency')
    this.pollInterval = resolvePositiveInteger(options.pollInterval, 1000, 'pollInterval')
    this.leaseSeconds = resolvePositiveInteger(options.leaseSeconds, 60, 'leaseSeconds')
    this.workerId = options.workerId || `worker-${randomUUID()}`
    this.logger = options.logger || new Logger('@faasjs/jobs')
    this.loop = new LoopRunner({
      interval: this.pollInterval,
      logger: this.logger,
      task: () => this.poll(),
    })
  }

  /**
   * Start the worker's polling loop. No-op if already active.
   *
   * @returns The worker instance (for chaining).
   */
  public start(): this {
    this.loop.start()

    return this
  }

  /**
   * Stop the polling loop. Waits for the current poll to complete
   * before resolving.
   */
  public async stop(): Promise<void> {
    await this.loop.stop()
  }

  private async claim(client: Client): Promise<JobRecord | undefined> {
    const leaseId = randomUUID()
    const [record] = await client.transaction(async (trx) => {
      await trx.raw(
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
          WHERE queue = ?
            AND status = 'running'
            AND locked_until < NOW()
            AND attempts >= max_attempts
        `,
        EXPIRED_LEASE_ERROR,
        this.queue,
      )

      return trx.raw<JobRecord>(
        `
          WITH picked AS (
            SELECT id
            FROM faasjs_jobs
            WHERE queue = ?
              AND run_at <= NOW()
              AND attempts < max_attempts
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
      )
    })

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
          job: record,
          attempt: record.attempts,
        },
        {
          runtime: 'job',
          job: record,
          workerId: this.workerId,
        } as any,
      )

      await this.complete(client, record)
    } catch (error) {
      await this.fail(client, record, error, definition)
    }
  }

  /**
   * Execute one polling cycle: claim up to `concurrency` pending jobs
   * and run their handlers. No-op if a poll is already in progress.
   * Handler failures are recorded in PostgreSQL and retried or marked failed.
   *
   * @returns The number of jobs processed in this cycle.
   */
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

/**
 * Discover job definitions and start a worker immediately.
 *
 * This is the recommended shorthand for initializing the schema,
 * loading the job registry, and starting the polling loop in one call.
 *
 * @param options - Worker options.
 * @returns A running `JobWorker` instance.
 *
 * @example
 * const worker = await startJobWorker({ concurrency: 5 })
 */
export async function startJobWorker(options: JobWorkerOptions = {}): Promise<JobWorker> {
  const client = await getClient()

  await ensureJobsSchema(client)

  const worker = new JobWorker(await loadJobRegistry(options), options)

  worker.start()

  return worker
}
