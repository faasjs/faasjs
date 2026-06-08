import { Func, type Handler } from '@faasjs/core'
import { parseSchemaValue } from '@faasjs/node-utils'
import type { ZodType } from '@faasjs/utils'

import { resolveMaxAttempts, resolveQueue } from '../options'
import {
  DEFAULT_JOB_MAX_ATTEMPTS,
  DEFAULT_JOB_QUEUE,
  type DefineJobData,
  type DefineJobOptions,
  type DefineJobParams,
  type JobCron,
  type JobEvent,
  type JobRetry,
  type JobRecord,
} from '../types'

function defaultJobRecord(overrides: Partial<JobRecord> | undefined, attempt: number): JobRecord {
  const now = new Date(0)

  return {
    id: '00000000-0000-0000-0000-000000000000',
    job_path: '',
    queue: DEFAULT_JOB_QUEUE,
    params: {},
    status: 'running',
    run_at: now,
    priority: 0,
    attempts: attempt,
    max_attempts: DEFAULT_JOB_MAX_ATTEMPTS,
    locked_by: null,
    lease_id: null,
    locked_until: null,
    last_error: null,
    idempotency_key: null,
    cron_key: null,
    scheduled_at: null,
    created_at: now,
    updated_at: now,
    completed_at: null,
    failed_at: null,
    ...overrides,
  }
}

/**
 * Executable job definition returned by {@link defineJob}.
 */
export class Job<
  TSchema extends ZodType | undefined = undefined,
  TContext = any,
  TResult = any,
> extends Func<JobEvent<TSchema>, TContext, TResult> {
  /**
   * Marker used by the job loader to recognize job definitions.
   *
   * @internal
   */
  public readonly __faasjsJob = true
  /** Zod schema used to validate job params before the handler runs. */
  public readonly schema: TSchema | undefined
  /** Normalized queue name used by default enqueues and workers. */
  public readonly queue: string
  /** Normalized maximum attempts before a job is marked failed. */
  public readonly maxAttempts: number
  /** Retry strategy used after failed attempts. */
  public readonly retry: JobRetry | undefined
  /** Cron rules used by {@link JobScheduler} to enqueue scheduled jobs. */
  public readonly cron: JobCron<DefineJobParams<TSchema>>[]

  constructor(options: DefineJobOptions<TSchema, TContext, TResult>) {
    const invokeHandler: Handler<JobEvent<TSchema>, TContext, TResult> = async (data) => {
      const params = await parseSchemaValue<TSchema>({
        schema: options.schema,
        value: data.event.params,
        errorMessage: 'Invalid job params',
      })
      const attempt = data.event.attempt ?? data.event.job?.attempts ?? 1

      return options.handler({
        ...data,
        params,
        job: defaultJobRecord(data.event.job, attempt),
        attempt,
      } as DefineJobData<TSchema, TContext, TResult>)
    }

    super({
      runtime: 'job',
      plugins: [],
      handler: invokeHandler,
    })

    this.schema = options.schema
    this.queue = resolveQueue(options.queue)
    this.maxAttempts = resolveMaxAttempts(options.maxAttempts)
    this.retry = options.retry
    this.cron = options.cron || []
  }
}

/**
 * Check whether a value is a valid {@link Job} definition.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a `Job` instance.
 */
export function isJob(value: unknown): value is Job<any, any, any> {
  return Boolean(value && typeof value === 'object' && (value as any).__faasjsJob === true)
}

/**
 * Define a PostgreSQL-backed background job.
 *
 * The returned job can be loaded from a `.job.ts` file by `startJobWorker`
 * and `startJobScheduler`. When `schema` is provided, handler `params` are
 * inferred from the schema output type. Without `schema`, handler `params` are
 * typed as `Record<string, never>`.
 *
 * @param options - Job schema, defaults, cron rules, retry strategy, and handler.
 * @returns A {@link Job} instance with normalized queue, retry, and cron metadata.
 *
 * @example
 * ```ts
 * import { defineJob } from '@faasjs/jobs'
 * import { z } from '@faasjs/utils'
 *
 * export default defineJob({
 *   schema: z.object({ userId: z.string() }),
 *   async handler({ params, job, attempt, logger }) {
 *     logger.info('Sync %s from job %s attempt %s', params.userId, job.id, attempt)
 *   },
 * })
 * ```
 */
export function defineJob<
  TSchema extends ZodType | undefined = undefined,
  TContext = any,
  THandler extends (data: DefineJobData<TSchema, TContext, any>) => any = (
    data: DefineJobData<TSchema, TContext, any>,
  ) => any,
>(
  options: Omit<DefineJobOptions<TSchema, TContext, Awaited<ReturnType<THandler>>>, 'handler'> & {
    handler: THandler
  },
): Job<TSchema, TContext, Awaited<ReturnType<THandler>>> {
  return new Job(options)
}
