import type { InvokeData } from '@faasjs/core'
import type { SchemaOutput } from '@faasjs/node-utils'
import type { input, ZodType } from '@faasjs/utils'

export const DEFAULT_JOB_QUEUE = 'default'
export const DEFAULT_JOB_MAX_ATTEMPTS = 3

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed'

/**
 * Persisted row from the `faasjs_jobs` table.
 */
export type JobRecord = {
  id: string
  job_path: string
  queue: string
  params: unknown
  status: JobStatus
  run_at: Date | string
  priority: number
  attempts: number
  max_attempts: number
  locked_by: string | null
  lease_id: string | null
  locked_until: Date | string | null
  last_error: string | null
  idempotency_key: string | null
  cron_key: string | null
  scheduled_at: Date | string | null
  created_at: Date | string
  updated_at: Date | string
  completed_at: Date | string | null
  failed_at: Date | string | null
}

export type JobRetryContext = {
  error: Error
  job: JobRecord
  attempt: number
}

export type JobRetryOptions = {
  delay?: number
  multiplier?: number
  maxDelay?: number
}

export type JobRetry =
  | number
  | JobRetryOptions
  | ((context: JobRetryContext) => Date | number | Promise<Date | number>)

/**
 * Cron rule that enqueues a job with optional schema-typed params.
 */
export type JobCron<TParams = Record<string, never>> = {
  expression: string
  timezone?: string
  /**
   * Params passed to the job when this cron rule enqueues it.
   */
  params?: TParams
  queue?: string
  priority?: number
  maxAttempts?: number
}

/**
 * Runtime event passed to the underlying job function.
 */
export type JobEvent<TSchema extends ZodType | undefined = undefined> = {
  params?: TSchema extends ZodType ? input<TSchema> : Record<string, any>
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
  job: JobRecord
  attempt: number
} & DefineJobInject

export interface DefineJobInject extends Record<never, never> {}

export type DefineJobOptions<
  TSchema extends ZodType | undefined = undefined,
  TContext = any,
  TResult = any,
> = {
  schema?: TSchema
  queue?: string
  maxAttempts?: number
  retry?: JobRetry
  cron?: JobCron<DefineJobParams<TSchema>>[]
  handler: (data: DefineJobData<TSchema, TContext, TResult>) => TResult | Promise<TResult>
}

export type EnqueueJobOptions = {
  queue?: string
  runAt?: Date
  priority?: number
  idempotencyKey?: string
  maxAttempts?: number
}

export type InternalEnqueueJobOptions = EnqueueJobOptions & {
  cronKey?: string
  scheduledAt?: Date
}
