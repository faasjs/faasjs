import { Func, type Handler } from '@faasjs/core'
import { parseSchemaValue } from '@faasjs/node-utils'
import type { ZodType } from 'zod'

import { resolveMaxAttempts, resolveQueue } from './options'
import {
  type DefineJobData,
  type DefineJobOptions,
  type DefineJobParams,
  type JobCron,
  type JobEvent,
  type JobRetry,
} from './types'

/**
 * Executable job definition returned by {@link defineJob}.
 */
export class Job<
  TSchema extends ZodType | undefined = undefined,
  TContext = any,
  TResult = any,
> extends Func<JobEvent<TSchema>, TContext, TResult> {
  public readonly __faasjsJob = true
  public readonly schema: TSchema | undefined
  public readonly queue: string
  public readonly maxAttempts: number
  public readonly retry: JobRetry | undefined
  public readonly cron: JobCron<DefineJobParams<TSchema>>[]

  constructor(options: DefineJobOptions<TSchema, TContext, TResult>) {
    const invokeHandler: Handler<JobEvent<TSchema>, TContext, TResult> = async (data) => {
      const params = await parseSchemaValue<TSchema>({
        schema: options.schema,
        value: data.event.params,
        errorMessage: 'Invalid job params',
      })

      return options.handler({
        ...data,
        params,
        client: data.event.client,
        job: data.event.job,
        attempt: data.event.attempt,
      } as DefineJobData<TSchema, TContext, TResult>)
    }

    super({
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
