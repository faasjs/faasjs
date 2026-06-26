import { createHash, randomUUID } from 'node:crypto'

import { Logger } from '@faasjs/node-utils'
import { getClient } from '@faasjs/pg'

import { cronMatches, truncateToMinute } from './cron'
import { loadJobRegistry, type JobRegistry, type LoadJobRegistryOptions } from './discovery'
import { LoopRunner } from './loop-runner'
import { resolveMaxAttempts, resolvePositiveInteger, resolveQueue } from './options'
import { ensureJobsSchema, enqueueJobInternal } from './queue'
import type { JobCron } from './types'

/**
 * Options for {@link startJobScheduler}.
 */
export type JobSchedulerOptions = LoadJobRegistryOptions & {
  /** Milliseconds between cron ticks. Defaults to `30000` (30s). */
  pollInterval?: number
  /** Unique identifier for this scheduler instance. Auto-generated when omitted. */
  schedulerId?: string
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(',')}]`

  if (value && typeof value === 'object') {
    const object = value as Record<string, unknown>

    return `{${Object.keys(object)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(object[key])}`)
      .join(',')}}`
  }

  return JSON.stringify(value)
}

function createCronKey(jobPath: string, rule: JobCron, queue: string, params: unknown): string {
  return createHash('sha256')
    .update(
      stableStringify({
        jobPath,
        expression: rule.expression,
        timezone: rule.timezone || '',
        queue,
        params,
      }),
    )
    .digest('hex')
}

/**
 * Periodic scheduler that iterates over registered job definitions,
 * evaluates their cron rules, and enqueues matching jobs at the top
 * of each minute.
 * The scheduler only enqueues rows; workers execute handlers.
 *
 * Deduplicates cron enqueues by computing a hash of the rule configuration
 * (job path, expression, timezone, queue, params) and using it as a
 * conflict key in the database.
 *
 * @example
 * const scheduler = new JobScheduler(registry, { pollInterval: 60_000 })
 * scheduler.start()
 */
export class JobScheduler {
  /** Milliseconds between automatic cron ticks. */
  public readonly pollInterval: number
  /** Unique scheduler id used in logs. */
  public readonly schedulerId: string
  /** Loaded job registry keyed by job path. */
  public readonly jobs: JobRegistry
  /** Scheduler logger. */
  public readonly logger: Logger

  private ticking = false
  private readonly loop: LoopRunner

  constructor(jobs: JobRegistry, options: JobSchedulerOptions = {}) {
    this.jobs = jobs
    this.pollInterval = resolvePositiveInteger(options.pollInterval, 30_000, 'pollInterval')
    this.schedulerId = options.schedulerId || `scheduler-${randomUUID()}`
    this.logger = options.logger || new Logger('@faasjs/jobs')
    this.loop = new LoopRunner({
      interval: this.pollInterval,
      logger: this.logger,
      task: () => this.tick(),
    })
  }

  /**
   * Start the scheduler's cron loop. No-op if already active.
   *
   * @returns The scheduler instance (for chaining).
   */
  public start(): this {
    this.loop.start()

    return this
  }

  /**
   * Stop the scheduler loop. Waits for the current tick to complete
   * before resolving.
   */
  public async stop(): Promise<void> {
    await this.loop.stop()
  }

  /**
   * Execute one scheduling tick: evaluate all cron rules against the
   * current minute and enqueue matching jobs. No-op if a tick is
   * already in progress.
   *
   * @param now - The reference time (defaults to the current instant).
   * @returns The number of matching cron rules processed in this tick. Existing
   * deduplicated rows may be returned instead of newly inserted rows.
   */
  public async tick(now = new Date()): Promise<number> {
    if (this.ticking) return 0

    this.ticking = true

    try {
      const scheduledAt = truncateToMinute(now)
      let count = 0

      for (const [jobPath, definition] of this.jobs) {
        for (const rule of definition.cron) {
          if (!cronMatches(rule.expression, scheduledAt, rule.timezone)) continue

          const params = rule.params ?? {}
          const queue = resolveQueue(rule.queue ?? definition.queue)
          const cronKey = createCronKey(jobPath, rule, queue, params)
          const options = {
            queue,
            runAt: scheduledAt,
            maxAttempts: resolveMaxAttempts(rule.maxAttempts ?? definition.maxAttempts),
            cronKey,
            scheduledAt,
            ...(rule.priority === undefined ? {} : { priority: rule.priority }),
          }

          await enqueueJobInternal(jobPath, params, options)
          count += 1
        }
      }

      return count
    } finally {
      this.ticking = false
    }
  }
}

/**
 * Discover job definitions and start a scheduler immediately.
 *
 * This is the recommended shorthand for initializing the schema,
 * loading the job registry, and starting the cron loop in one call.
 *
 * @param options - Scheduler options.
 * @returns A running `JobScheduler` instance.
 *
 * @example
 * const scheduler = await startJobScheduler({ pollInterval: 60_000 })
 */
export async function startJobScheduler(options: JobSchedulerOptions = {}): Promise<JobScheduler> {
  const client = await getClient()

  await ensureJobsSchema(client)

  const scheduler = new JobScheduler(await loadJobRegistry(options), options)

  scheduler.start()

  return scheduler
}
