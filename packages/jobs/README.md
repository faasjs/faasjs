# @faasjs/jobs

# @faasjs/jobs

PostgreSQL-backed background jobs for FaasJS.

Jobs are persisted in PostgreSQL, executed with at-least-once delivery, and split
between enqueueing, worker polling, and scheduler cron enqueueing. Handlers should
be idempotent and use retry options to make failure behavior explicit.

## Install

```sh
npm install @faasjs/jobs @faasjs/pg
```

## Usage

```ts
import { defineJob, enqueueJob } from '@faasjs/jobs'
import { z } from '@faasjs/utils'

export default defineJob({
  schema: z.object({
    userId: z.string(),
  }),
  async handler({ params }) {
    console.log(params.userId)
  },
})

await enqueueJob('features/users/jobs/sync', { userId: 'u_123' })
```

## Functions

- [defineJob](functions/defineJob.md)
- [enqueueJob](functions/enqueueJob.md)
- [startJobScheduler](functions/startJobScheduler.md)
- [startJobWorker](functions/startJobWorker.md)

## Classes

- [Job](classes/Job.md)
- [JobScheduler](classes/JobScheduler.md)
- [JobWorker](classes/JobWorker.md)

## Interfaces

- [DefineJobInject](interfaces/DefineJobInject.md)

## Type Aliases

- [DefineJobData](type-aliases/DefineJobData.md)
- [DefineJobOptions](type-aliases/DefineJobOptions.md)
- [DefineJobParams](type-aliases/DefineJobParams.md)
- [EnqueueJobOptions](type-aliases/EnqueueJobOptions.md)
- [JobCron](type-aliases/JobCron.md)
- [JobEvent](type-aliases/JobEvent.md)
- [JobRecord](type-aliases/JobRecord.md)
- [JobRegistry](type-aliases/JobRegistry.md)
- [JobRetry](type-aliases/JobRetry.md)
- [JobRetryContext](type-aliases/JobRetryContext.md)
- [JobRetryOptions](type-aliases/JobRetryOptions.md)
- [JobSchedulerOptions](type-aliases/JobSchedulerOptions.md)
- [JobStatus](type-aliases/JobStatus.md)
- [JobWorkerOptions](type-aliases/JobWorkerOptions.md)
- [LoadJobRegistryOptions](type-aliases/LoadJobRegistryOptions.md)
