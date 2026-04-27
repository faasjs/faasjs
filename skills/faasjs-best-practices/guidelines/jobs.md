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

import { sendWelcomeEmail } from '../emails/send-welcome-email'

export default defineJob({
  schema: z.object({
    userId: z.string(),
  }),
  async handler({ params, logger, job }) {
    logger.info('send welcome email to user %s via job %s', params.userId, job.id)

    await sendWelcomeEmail(params.userId)
  },
})
```

When a job needs database access, use `getClient()` from `@faasjs/pg` inside the handler. Job handlers do not receive an externally provided database client, so tests and callers cannot silently swap the default database path.

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
- Keep the `defineJob` wrapper, schema validation, and database writes real in job tests.
- Mock only external services such as email providers, storage APIs, or third-party webhooks.

### 7. Test a single job directly

Put job tests close to the job file, such as `src/jobs/users/__tests__/cleanup.test.ts` or `src/jobs/__tests__/users.cleanup.test.ts`.

For a single job's business behavior, call the exported job handler directly. This keeps the `defineJob` wrapper, schema validation, `job`, and `attempt` shape real without creating queue rows or starting worker loops.

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

import dailyReportJob from '../daily-report.job'
import { sendDailyReport } from '../send-daily-report'

vi.mock('../send-daily-report', () => ({
  sendDailyReport: vi.fn(),
}))

const mockedSendDailyReport = vi.mocked(sendDailyReport)

describe('jobs/reports/daily-report', () => {
  beforeEach(() => {
    mockedSendDailyReport.mockReset()
  })

  it('sends the report', async () => {
    await expect(
      dailyReportJob.export().handler({
        params: {
          reportId: 'r_123',
        },
      }),
    ).resolves.toBeUndefined()

    expect(mockedSendDailyReport).toHaveBeenCalledWith('r_123')
  })
})
```

Use this direct style for handler success, schema validation, and controlled external-boundary failures. It does not test queue lifecycle behavior such as row creation, claiming, completion, retries, idempotency, or cron dedupe.

### 8. Test queue behavior only when it matters

Model queue behavior as an enqueue, worker, or scheduler scenario:

- enqueue case: call `enqueueJob()` and assert the `faasjs_jobs` row shape, params, queue, priority, `max_attempts`, `run_at`, and idempotency behavior
- worker success case: enqueue a row, run `worker.poll()`, then assert the visible side effect and the completed job row
- validation case: enqueue invalid params with `maxAttempts: 1`, run `worker.poll()`, and assert the row failed with an `Invalid job params` error
- retry/failure case: make the handler fail through a controlled external boundary, then assert `attempts`, `status`, `last_error`, and next `run_at`
- cron case: call `scheduler.tick(fixedDate)` once or twice and assert pending rows, `cron_key`, `scheduled_at`, and dedupe for the same minute

For focused queue tests, prefer public `JobWorker` and `JobScheduler` with a small in-memory registry. Call `poll()` or `tick(fixedDate)` directly instead of starting timer loops. Use `startJobWorker({ root })` or `startJobScheduler({ root })` only when the behavior under test is file discovery or startup wiring, and stop them in `finally`.

Example queue lifecycle tests:

```ts
import { enqueueJob, JobScheduler, JobWorker, type JobRecord } from '@faasjs/jobs'
import { getClient } from '@faasjs/pg'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import dailyReportJob from '../daily-report.job'
import { sendDailyReport } from '../send-daily-report'

vi.mock('../send-daily-report', () => ({
  sendDailyReport: vi.fn(),
}))

const mockedSendDailyReport = vi.mocked(sendDailyReport)

const jobs = new Map([['jobs/reports/daily-report', dailyReportJob]])

describe('jobs/reports/daily-report', () => {
  beforeEach(() => {
    mockedSendDailyReport.mockReset()
  })

  it('runs queued work and sends the report', async () => {
    const client = await getClient()
    const record = await enqueueJob('jobs/reports/daily-report', {
      reportId: 'r_123',
    })
    const worker = new JobWorker(jobs)

    expect(await worker.poll()).toEqual(1)

    const [updated] = await client.raw<JobRecord>`
      SELECT * FROM faasjs_jobs WHERE id = ${record.id}
    `

    expect(updated.status).toEqual('completed')
    expect(mockedSendDailyReport).toHaveBeenCalledWith('r_123')
  })

  it('deduplicates cron enqueue attempts for the same minute', async () => {
    const client = await getClient()
    const scheduler = new JobScheduler(jobs)
    const scheduledAt = new Date('2026-01-01T03:00:00.000Z')

    await scheduler.tick(scheduledAt)
    await scheduler.tick(scheduledAt)

    const rows = await client.raw<JobRecord>`
      SELECT * FROM faasjs_jobs
      WHERE job_path = 'jobs/reports/daily-report'
    `

    expect(rows).toHaveLength(1)
    expect(rows[0].cron_key).toBeTruthy()
    expect(rows[0].scheduled_at).toBeTruthy()
  })
})
```

## Review Checklist

- job files end with `.job.ts` and default-export `defineJob(...)`
- enqueue paths match file-derived job paths
- params are validated with schemas when structured
- handlers use `getClient()` when they need database access and use the injected `logger`
- idempotency and retry behavior are explicit
- cron rules enqueue jobs instead of doing work directly
- worker and scheduler startup are separate from HTTP server lifecycle
- tests cover enqueue shape, success, validation, retry/failure, and cron dedupe when relevant
