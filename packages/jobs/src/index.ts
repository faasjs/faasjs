/**
 * # @faasjs/jobs
 *
 * PostgreSQL-backed background jobs for FaasJS.
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
 * import * as z from 'zod'
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
 * await enqueueJob('jobs/users/sync', { userId: 'u_123' })
 * ```
 */

export type { JobRegistry, LoadJobRegistryOptions } from './discovery'
export { defineJob, Job } from './define_job'
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
