import type { InvokeData } from '@faasjs/core'
import type { Client } from '@faasjs/pg'
import type { output, ZodType } from 'zod'

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
  payload: unknown
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

export type JobCron<TPayload = unknown> = {
  expression: string
  timezone?: string
  payload?: TPayload
  queue?: string
  priority?: number
  maxAttempts?: number
}

export type JobEvent = {
  payload: unknown
  client: Client
  job: JobRecord
  attempt: number
}

export type DefineJobPayload<TSchema extends ZodType | undefined = undefined> =
  TSchema extends ZodType ? output<NonNullable<TSchema>> : Record<string, any>

export type DefineJobData<
  TPayload = Record<string, any>,
  TContext = any,
  TResult = any,
> = InvokeData<JobEvent, TContext, TResult> & {
  payload: TPayload
  client: Client
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
  cron?: JobCron<DefineJobPayload<TSchema>>[]
  handler: (
    data: DefineJobData<DefineJobPayload<TSchema>, TContext, TResult>,
  ) => TResult | Promise<TResult>
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
