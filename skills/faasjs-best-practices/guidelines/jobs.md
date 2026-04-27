# Jobs Guide

Use this guide when defining `.job.ts` background jobs, enqueueing asynchronous work, or running FaasJS workers and schedulers.

## Default Workflow

1. Create a `.job.ts` file under `src/jobs/`.
2. Default-export `defineJob(...)` with a schema when the params have a shape.
3. Enqueue work with `enqueueJob(jobPath, params)` from APIs, scripts, or other jobs.
4. Run `startJobWorker()` in a worker process for execution.
5. Run `startJobScheduler()` only when `.job.ts` files include `cron` rules.
6. Keep handlers idempotent; delivery is at-least-once.

## Rules

### 1. Let file paths name jobs

Job paths come from `.job.ts` files relative to the worker root:

```text
src/jobs/users/cleanup.job.ts -> jobs/users/cleanup
src/jobs/emails/send.job.ts   -> jobs/emails/send
src/jobs/reports/index.job.ts -> jobs/reports
```

Do not duplicate the job name inside the file. Moving or renaming a job file changes the path used by `enqueueJob()`.

### 2. Define params schemas at the boundary

```ts
import { defineJob } from '@faasjs/jobs'
import * as z from 'zod'

export default defineJob({
  schema: z.object({
    userId: z.string(),
  }),
  async handler({ params, client, logger, job }) {
    logger.info('sync user %s via job %s', params.userId, job.id)

    await client.raw`SELECT 1`
  },
})
```

Use the injected `client` from `@faasjs/pg`. Do not create or pass a second database client unless the job is deliberately talking to another database.

If a job has no business input, omit `schema`; `params` will be typed as `Record<string, never>`.

### 3. Enqueue asynchronous work explicitly

```ts
import { enqueueJob } from '@faasjs/jobs'

await enqueueJob(
  'jobs/emails/send',
  {
    userId: 'u_123',
  },
  {
    idempotencyKey: 'welcome-email:u_123',
    maxAttempts: 5,
    priority: 10,
  },
)
```

Use `idempotencyKey` for enqueue-side dedupe. It does not make the handler exactly-once, so database writes and external calls should still tolerate retries.

### 4. Separate scheduler from worker execution

Cron rules only enqueue jobs:

```ts
import { defineJob } from '@faasjs/jobs'
import * as z from 'zod'

export default defineJob({
  schema: z.object({
    source: z.string(),
  }),
  cron: [
    {
      expression: '0 3 * * *',
      timezone: 'Asia/Shanghai',
      params: {
        source: 'cron',
      },
    },
  ],
  async handler({ params }) {
    await cleanup(params.source)
  },
})
```

Run a scheduler process to create pending rows, and run worker processes to claim and execute rows. A process may start both, but HTTP server startup should not be the owner of job execution.

### 5. Treat execution as at-least-once

- Handlers may run again after crashes, lease expiry, database interruptions, or retryable failures.
- Prefer idempotent writes, unique keys, and explicit state transitions.
- Use `maxAttempts` and `retry` to make failure behavior visible instead of looping forever.
- Missing job files are recorded as job failures and retried according to the row's attempt policy.

### 6. Test with real PostgreSQL behavior

- Use `@faasjs/pg-dev` / PGlite tests for enqueue, worker, retry, and scheduler behavior.
- Keep the FaasJS loader, schema validation, and database writes real in job tests.
- Mock only external services such as email providers, storage APIs, or third-party webhooks.

## Review Checklist

- job files end with `.job.ts` and default-export `defineJob(...)`
- enqueue paths match file-derived job paths
- params are validated with schemas when structured
- handlers use the injected `client` and `logger`
- idempotency and retry behavior are explicit
- cron rules enqueue jobs instead of doing work directly
- worker and scheduler startup are separate from HTTP server lifecycle
- tests cover enqueue, success, retry/failure, and cron dedupe when relevant
