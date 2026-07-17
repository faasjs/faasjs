# Jobs Guide

Use this guide when defining `.job.ts` background jobs, enqueueing work, or connecting jobs to business transactions.

Load the [Job Types and Paths Guide](./job-types-and-paths.md) for generated enqueue types, the [Job Scheduling and Retries Guide](./job-scheduling-and-retries.md) for worker semantics, and the [Job Testing Guide](./job-testing.md) for test design.

## Contents

- [Default Workflow](#default-workflow)
- [Define Jobs At The Boundary](#define-jobs-at-the-boundary)
- [Enqueue Work Explicitly](#enqueue-work-explicitly)
- [Couple Business Writes And Enqueueing](#couple-business-writes-and-enqueueing)
- [Keep Process Ownership Explicit](#keep-process-ownership-explicit)
- [Review Checklist](#review-checklist)
- [See Also](#see-also)

## Default Workflow

1. Keep feature-owned jobs under `src/features/<feature>/jobs/`; use `src/jobs/` for cross-cutting jobs.
2. Default-export `defineJob(...)` and define a schema whenever params have a shape.
3. Enqueue through `enqueueJob(jobPath, params, options)` using the generated path and params types.
4. Let `@faasjs/jobs` initialize and own its internal tables.
5. Run workers and schedulers as background-process concerns, not as hidden HTTP server behavior.
6. Make handlers idempotent because execution is at-least-once.

## Define Jobs At The Boundary

```ts
import { defineJob } from '@faasjs/jobs'
import { z } from '@faasjs/utils'

import { sendWelcomeEmail } from '../emails/send-welcome-email'

export default defineJob({
  schema: z.object({
    userId: z.string(),
  }),
  async handler({ params, logger, job, attempt }) {
    logger.info(
      'send welcome email to user %s via job %s attempt %s',
      params.userId,
      job.id,
      attempt,
    )
    await sendWelcomeEmail(params.userId)
  },
})
```

- Keep business input visible as `params.userId`; destructure only the top-level handler context.
- Omit `schema` only for jobs with no business input. Their params type is `Record<string, never>`.
- Call `getClient()` inside a handler when it needs PostgreSQL. Job handlers do not receive a caller-supplied database client.
- Use the injected `logger`; do not log secrets or full sensitive payloads.

## Enqueue Work Explicitly

```ts
import { enqueueJob } from '@faasjs/jobs'

await enqueueJob(
  'features/emails/jobs/send',
  { userId: 'u_123' },
  {
    idempotencyKey: 'welcome-email:u_123',
    maxAttempts: 5,
    priority: 10,
  },
)
```

Use `idempotencyKey` for enqueue-side deduplication. It does not make the handler exactly-once, so writes and external calls must still tolerate retries.

Do not insert into or declare `faasjs_jobs` or `faasjs_jobs_schema_migrations` in application code. The jobs package owns those tables through `ensureJobsSchema()`.

## Couple Business Writes And Enqueueing

Pass a transaction client when the business write and job row must commit atomically:

```ts
import { enqueueJob } from '@faasjs/jobs'
import { getClient } from '@faasjs/pg'

const client = await getClient()

await client.transaction(async (trx) => {
  await trx.query('users').where('id', userId).update({ status: 'syncing' })
  await enqueueJob(
    'features/users/jobs/sync',
    { userId },
    {
      client: trx,
      idempotencyKey: `users:sync:${userId}`,
    },
  )
})
```

The `client` option changes only the database context used for that enqueue. Do not keep the transaction-scoped client after the callback completes.

## Keep Process Ownership Explicit

- Run `startJobWorker()` in a worker process to claim and execute queued rows.
- Run `startJobScheduler()` only when job definitions contain cron rules.
- A process may own both loops deliberately, but ordinary HTTP startup should not implicitly own job execution.
- Stop started workers and schedulers in `finally` during tests or short-lived scripts.

## Review Checklist

- job files end with `.job.ts` and default-export `defineJob(...)`
- structured params have a schema and callers use generated enqueue types
- handlers are idempotent and use explicit retry-safe state transitions
- enqueue deduplication uses `idempotencyKey` without assuming exactly-once execution
- transaction-coupled jobs pass `{ client: trx }`
- application migrations do not recreate internal jobs tables
- API-only plugins skip the `job` runtime and still call `await next()`
- worker and scheduler ownership is explicit and separate from HTTP request handling

## See Also

- [Job Types and Paths Guide](./job-types-and-paths.md)
- [Job Scheduling and Retries Guide](./job-scheduling-and-retries.md)
- [Job Testing Guide](./job-testing.md)
