import type { InvokeData } from '@faasjs/core'
import type { SchemaOutput } from '@faasjs/node-utils'
import type { Client } from '@faasjs/pg'
import type { ZodInfer, ZodType } from '@faasjs/utils'

/**
 * Default queue name used when none is specified.
 */
export const DEFAULT_JOB_QUEUE = 'default'

/**
 * Default maximum execution attempts for a job.
 */
export const DEFAULT_JOB_MAX_ATTEMPTS = 3

/**
 * Lifecycle status of a background job.
 */
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed'

/**
 * Persisted row from the `faasjs_jobs` table.
 */
export type JobRecord = {
  /** Unique job row id. */
  id: string
  /** Path-derived `.job.ts` identifier. */
  job_path: string
  /** Queue this row is claimed from. */
  queue: string
  /** Serialized params passed to the job handler. */
  params: unknown
  /** Current lifecycle status. */
  status: JobStatus
  /** Earliest time this row may be claimed. */
  run_at: Date | string
  /** Higher priority rows are claimed before lower priority rows. */
  priority: number
  /** Number of attempts already claimed. */
  attempts: number
  /** Maximum attempts before permanent failure. */
  max_attempts: number
  /** Worker id currently holding the lease. */
  locked_by: string | null
  /** Lease id used to complete or fail the claimed row. */
  lease_id: string | null
  /** Time when the current lease expires. */
  locked_until: Date | string | null
  /** Last failure message or stack. */
  last_error: string | null
  /** Optional idempotency key used to deduplicate manual enqueues. */
  idempotency_key: string | null
  /** Optional cron hash used to deduplicate scheduler rows by minute. */
  cron_key: string | null
  /** Minute timestamp associated with a scheduler enqueue. */
  scheduled_at: Date | string | null
  /** Row creation timestamp. */
  created_at: Date | string
  /** Row update timestamp. */
  updated_at: Date | string
  /** Completion timestamp. */
  completed_at: Date | string | null
  /** Final failure timestamp. */
  failed_at: Date | string | null
}

/**
 * Context passed to a retry function after a job failure.
 */
export type JobRetryContext = {
  /** The error that caused the failure. */
  error: Error
  /** The job record at the time of failure. */
  job: JobRecord
  /** The current attempt number (1-indexed). */
  attempt: number
}

/**
 * Configuration for exponential backoff retry delays.
 */
export type JobRetryOptions = {
  /** Initial delay in milliseconds before the first retry. Defaults to `30000` (30s). */
  delay?: number
  /** Multiplier applied to the delay on each subsequent retry. Defaults to `2`. */
  multiplier?: number
  /** Maximum delay cap in milliseconds. Defaults to `300000` (5 min). */
  maxDelay?: number
}

/**
 * Retry strategy — a fixed delay in milliseconds, exponential backoff options,
 * or a custom function that receives the failure context and returns a delay
 * or a specific retry date.
 */
export type JobRetry =
  | number
  | JobRetryOptions
  | ((context: JobRetryContext) => Date | number | Promise<Date | number>)

/**
 * Cron rule that enqueues a job with optional schema-typed params.
 */
export type JobCron<TParams = Record<string, never>> = {
  /** Cron expression string (5-field format: minute hour day month weekday). */
  expression: string
  /** Optional IANA timezone (e.g. `'America/New_York'`). */
  timezone?: string
  /**
   * Params passed to the job when this cron rule enqueues it.
   */
  params?: TParams
  /** Queue name. Defaults to the job's queue or `'default'`. */
  queue?: string
  /** Execution priority for this cron rule. */
  priority?: number
  /** Maximum execution attempts for this cron rule. */
  maxAttempts?: number
}

/**
 * Runtime event passed to the underlying job function.
 */
export type JobEvent<TSchema extends ZodType | undefined = undefined> = {
  /** Raw params passed to the job. They are validated before `handler` receives `params`. */
  params?: TSchema extends ZodType ? ZodInfer<TSchema> : Record<string, any>
  /**
   * Job metadata. Defaults are filled when omitted, which keeps direct job tests small.
   */
  job?: Partial<JobRecord>
  /**
   * Current execution attempt. Defaults to `1` when omitted.
   */
  attempt?: number
}

/**
 * Params validated by the optional Zod schema.
 */
export type DefineJobParams<TSchema extends ZodType | undefined = undefined> = SchemaOutput<
  TSchema,
  Record<string, never>
>

/**
 * Handler data passed to {@link defineJob}.
 */
export type DefineJobData<
  TSchema extends ZodType | undefined = undefined,
  TContext = any,
  TResult = any,
> = InvokeData<JobEvent<TSchema>, TContext, TResult> & {
  /**
   * Params validated by the optional Zod schema.
   */
  params: DefineJobParams<TSchema>
  /**
   * Persisted job row. Direct tests receive deterministic defaults when omitted.
   */
  job: JobRecord
  /**
   * Current execution attempt, starting at `1`.
   */
  attempt: number
} & DefineJobInject

/**
 * Interface that plugins can augment with additional properties via
 * TypeScript module augmentation.
 */
export interface DefineJobInject extends Record<never, never> {}

/**
 * Options for {@link defineJob}.
 */
export type DefineJobOptions<
  TSchema extends ZodType | undefined = undefined,
  TContext = any,
  TResult = any,
> = {
  /** Optional Zod schema used to validate and type handler params. */
  schema?: TSchema
  /** Queue name. Defaults to `'default'`. */
  queue?: string
  /** Maximum execution attempts. Defaults to `3`. */
  maxAttempts?: number
  /** Retry strategy for failed attempts. */
  retry?: JobRetry
  /** Cron rules that trigger scheduled invocations of this job. */
  cron?: JobCron<DefineJobParams<TSchema>>[]
  /** The job handler function. */
  handler: (data: DefineJobData<TSchema, TContext, TResult>) => TResult | Promise<TResult>
}

/**
 * Options for {@link enqueueJob}.
 */
export type EnqueueJobOptions = {
  /**
   * Database client used for this enqueue. Pass a transaction client to make
   * the job insert atomic with surrounding business writes.
   */
  client?: Client
  /** Queue name. Defaults to `'default'`. */
  queue?: string
  /** Earliest time the job should run. Defaults to now. */
  runAt?: Date
  /** Execution priority. Higher values run first. Defaults to `0`. */
  priority?: number
  /**
   * Idempotency key. Jobs with the same key are only inserted once.
   * Used to prevent duplicate enqueues for the same logical operation.
   */
  idempotencyKey?: string
  /** Maximum execution attempts. Defaults to `3`. */
  maxAttempts?: number
}

/**
 * Internal enqueue options extended with scheduler-specific fields.
 *
 * @internal
 */
export type InternalEnqueueJobOptions = EnqueueJobOptions & {
  /** Cron rule hash for deduplication. Set by the scheduler. */
  cronKey?: string
  /** Truncated time of the cron tick. Set by the scheduler. */
  scheduledAt?: Date
}
