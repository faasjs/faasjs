# Job Testing Guide

Use this guide when testing job handlers, queue rows, workers, schedulers, retries, discovery, or transaction-coupled enqueueing.

## Choose The Smallest Real Boundary

- Test a handler directly for schema validation, business behavior, and controlled external failures.
- Test queue behavior with real PostgreSQL/PGlite when row state, claiming, retries, leases, deduplication, or transactions matter.
- Test filesystem discovery only when paths, startup, or module loading are the behavior under review.
- Mock external services such as email, storage, or webhooks; keep `defineJob`, schema parsing, database writes, and queue state real.

## Direct Handler Test

Keep the job definition wrapper and its deterministic `job` and `attempt` defaults:

```ts
import { describe, expect, it, vi } from 'vitest'

import dailyReportJob from '../daily-report.job'
import { sendDailyReport } from '../send-daily-report'

vi.mock('../send-daily-report', () => ({ sendDailyReport: vi.fn() }))

describe('daily report job', () => {
  it('sends the report', async () => {
    await expect(
      dailyReportJob.export().handler({
        params: { reportId: 'r_123' },
      }),
    ).resolves.toBeUndefined()

    expect(sendDailyReport).toHaveBeenCalledWith('r_123')
  })
})
```

This style does not test persisted queue lifecycle behavior.

## Queue Scenarios

Use public `JobWorker` and `JobScheduler` with a small in-memory registry. Call `poll()` or `tick(fixedDate)` directly instead of starting timer loops.

- enqueue: assert row params, queue, priority, `max_attempts`, `run_at`, and idempotency behavior
- worker success: assert the visible side effect and completed row
- validation failure: enqueue invalid params with `maxAttempts: 1` and assert `last_error`
- retry: force a controlled failure and assert `attempts`, status, `last_error`, and next `run_at`
- lease: cover retryable expired leases and final-attempt expired leases separately
- cron: use a fixed date and assert `cron_key`, `scheduled_at`, timezone behavior, and same-minute deduplication
- transaction: enqueue with `{ client: trx }`, roll back, and assert neither business state nor the job row committed

Use `startJobWorker({ root })` or `startJobScheduler({ root })` only for discovery or startup wiring. Stop them in `finally`.

## Type And Discovery Scenarios

- generate declarations for a job-only project
- assert a valid path accepts its schema-derived params
- assert an unknown path and incorrect params fail typechecking
- reject duplicate normalized paths
- compare generated paths with runtime registry keys under the production root

## Review Checklist

- direct tests retain the real `defineJob` wrapper and schema
- database-backed tests use isolated data and assert persisted row state
- time-dependent tests pass fixed dates instead of waiting for timers
- retry and lease tests assert attempt limits, not only handler call counts
- transaction tests prove both the business write and enqueue roll back
- discovery tests use the same root configuration as production
