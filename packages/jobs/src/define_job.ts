import { Func, type Handler } from '@faasjs/core'
import type { ZodError, ZodType } from 'zod'

import {
  DEFAULT_JOB_MAX_ATTEMPTS,
  DEFAULT_JOB_QUEUE,
  type DefineJobData,
  type DefineJobOptions,
  type DefineJobPayload,
  type JobCron,
  type JobEvent,
  type JobRetry,
} from './types'

function normalizeIssueMessage(message: string): string {
  return message.replace(': expected', ', expected').replace(/>=\s+/g, '>=').replace(/<=\s+/g, '<=')
}

function formatZodErrorMessage(error: ZodError): string {
  const lines = ['Invalid job payload']

  for (const issue of error.issues) {
    const path = issue.path.length ? issue.path.map((item) => String(item)).join('.') : '<root>'

    lines.push(`${path}: ${normalizeIssueMessage(issue.message)}`)
  }

  return lines.join('\n')
}

async function parsePayload<TSchema extends ZodType | undefined>(
  schema: TSchema,
  payload: unknown,
): Promise<DefineJobPayload<TSchema>> {
  if (!schema) return (payload ?? {}) as DefineJobPayload<TSchema>

  const result = await schema.safeParseAsync(payload ?? {})

  if (!result.success) throw Error(formatZodErrorMessage(result.error))

  return result.data as DefineJobPayload<TSchema>
}

/**
 * Executable job definition returned by {@link defineJob}.
 */
export class Job<
  TSchema extends ZodType | undefined = undefined,
  TContext = any,
  TResult = any,
> extends Func<JobEvent, TContext, TResult> {
  public readonly __faasjsJob = true
  public readonly schema: TSchema | undefined
  public readonly queue: string
  public readonly maxAttempts: number
  public readonly retry: JobRetry | undefined
  public readonly cron: JobCron<DefineJobPayload<TSchema>>[]

  constructor(options: DefineJobOptions<TSchema, TContext, TResult>) {
    const invokeHandler: Handler<JobEvent, TContext, TResult> = async (data) => {
      const payload = await parsePayload(options.schema, data.event.payload)

      return options.handler({
        ...data,
        payload,
        client: data.event.client,
        job: data.event.job,
        attempt: data.event.attempt,
      } as DefineJobData<DefineJobPayload<TSchema>, TContext, TResult>)
    }

    super({
      plugins: [],
      handler: invokeHandler,
    })

    if (options.queue !== undefined && !options.queue.trim())
      throw Error('[defineJob] queue must not be empty.')

    if (
      options.maxAttempts !== undefined &&
      (!Number.isInteger(options.maxAttempts) || options.maxAttempts <= 0)
    )
      throw Error('[defineJob] maxAttempts must be a positive integer.')

    this.schema = options.schema
    this.queue = options.queue ?? DEFAULT_JOB_QUEUE
    this.maxAttempts = options.maxAttempts ?? DEFAULT_JOB_MAX_ATTEMPTS
    this.retry = options.retry
    this.cron = options.cron || []
  }
}

export function isJob(value: unknown): value is Job<any, any, any> {
  return Boolean(value && typeof value === 'object' && (value as any).__faasjsJob === true)
}

/**
 * Define a PostgreSQL-backed background job.
 *
 * The returned job can be loaded from a `.job.ts` file by `startJobWorker`
 * and `startJobScheduler`.
 */
export function defineJob<
  TSchema extends ZodType | undefined = undefined,
  TContext = any,
  THandler extends (data: DefineJobData<DefineJobPayload<TSchema>, TContext, any>) => any = (
    data: DefineJobData<DefineJobPayload<TSchema>, TContext, any>,
  ) => any,
>(
  options: Omit<DefineJobOptions<TSchema, TContext, Awaited<ReturnType<THandler>>>, 'handler'> & {
    handler: THandler
  },
): Job<TSchema, TContext, Awaited<ReturnType<THandler>>> {
  return new Job(options)
}
