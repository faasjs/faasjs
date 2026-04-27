import { createHash, randomUUID } from 'node:crypto'

import { Logger } from '@faasjs/node-utils'
import { getClient } from '@faasjs/pg'

import { cronMatches, truncateToMinute } from './cron'
import { loadJobRegistry, type JobRegistry, type LoadJobRegistryOptions } from './discovery'
import { resolveMaxAttempts, resolvePositiveInteger, resolveQueue } from './options'
import { ensureJobsSchema, enqueueJobInternal } from './queue'
import type { JobCron } from './types'

export type JobSchedulerOptions = LoadJobRegistryOptions & {
  pollInterval?: number
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

export class JobScheduler {
  public readonly pollInterval: number
  public readonly schedulerId: string
  public readonly jobs: JobRegistry
  public readonly logger: Logger

  private active = false
  private ticking = false
  private timer: NodeJS.Timeout | undefined
  private currentTick: Promise<number> | undefined

  constructor(jobs: JobRegistry, options: JobSchedulerOptions = {}) {
    this.jobs = jobs
    this.pollInterval = resolvePositiveInteger(options.pollInterval, 30_000, 'pollInterval')
    this.schedulerId = options.schedulerId || `scheduler-${randomUUID()}`
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

    if (this.currentTick) await this.currentTick
  }

  private schedule(delay: number): void {
    if (!this.active) return

    this.timer = setTimeout(() => {
      this.currentTick = this.tick()
        .catch((error) => {
          this.logger.error(error)

          return 0
        })
        .finally(() => {
          this.currentTick = undefined
          this.schedule(this.pollInterval)
        })
    }, delay)
  }

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

export async function startJobScheduler(options: JobSchedulerOptions = {}): Promise<JobScheduler> {
  const client = await getClient()

  await ensureJobsSchema(client)

  const scheduler = new JobScheduler(await loadJobRegistry(options), options)

  scheduler.start()

  return scheduler
}
