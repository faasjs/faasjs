/**
 * # @faasjs/jobs
 *
 * PostgreSQL-backed background jobs for FaasJS.
 *
 * Jobs are persisted in PostgreSQL, executed with at-least-once delivery, and split
 * between enqueueing, worker polling, and scheduler cron enqueueing. Handlers should
 * be idempotent and use retry options to make failure behavior explicit.
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/jobs @faasjs/pg
 * ```
 *
 * ## Usage
 *
 * ```ts
 * import { defineJob, enqueueJob } from '@faasjs/jobs'
 * import { z } from '@faasjs/utils'
 *
 * export default defineJob({
 *   schema: z.object({
 *     userId: z.string(),
 *   }),
 *   async handler({ params }) {
 *     console.log(params.userId)
 *   },
 * })
 *
 * await enqueueJob('features/users/jobs/sync', { userId: 'u_123' })
 * ```
 *
 * @packageDocumentation
 */

export type { JobRegistry, LoadJobRegistryOptions } from './discovery'
export { defineJob, Job } from './define-job'
export { enqueueJob } from './queue'
export { JobScheduler, startJobScheduler } from './scheduler'
export type { JobSchedulerOptions } from './scheduler'
export { JobWorker, startJobWorker } from './worker'
export type { JobWorkerOptions } from './worker'
export type {
  DefineJobData,
  DefineJobInject,
  DefineJobOptions,
  DefineJobParams,
  EnqueueJobOptions,
  JobCron,
  JobEvent,
  JobRecord,
  JobRetry,
  JobRetryContext,
  JobRetryOptions,
  JobStatus,
} from './types'
