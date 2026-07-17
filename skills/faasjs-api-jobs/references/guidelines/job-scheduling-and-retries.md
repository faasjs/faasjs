# Job Scheduling and Retries Guide

Use this guide when configuring cron rules, retry delays, worker leases, queues, or scheduler/worker lifecycle behavior.

## Scheduling Contract

Cron rules enqueue rows; they never execute handlers directly. Run a scheduler to create pending rows and one or more workers to claim them.

```ts
export default defineJob({
  schema: z.object({ source: z.string() }),
  cron: [
    {
      expression: '0 3 * * *',
      timezone: 'Asia/Shanghai',
      params: { source: 'cron' },
    },
  ],
  async handler({ params }) {
    await cleanup(params.source)
  },
})
```

FaasJS accepts the standard five fields `minute hour dayOfMonth month dayOfWeek` with:

- wildcards (`*`), comma-separated values, ranges (`-`), and steps (`/`)
- a single-value step such as `5/10`, meaning start at `5` and continue to the field maximum
- day-of-week values `0` through `7`, with both `0` and `7` representing Sunday
- abbreviated weekday names `SUN` through `SAT`, case-insensitively
- an optional IANA `timezone`; omit it to evaluate against the process-local time zone

Day matching follows standard cron OR behavior: when both day-of-month and day-of-week are restricted, either may match. When one is `*`, the other controls the result.

Scheduler ticks are truncated to the minute. Repeating the same rule for the same job, params, queue, and minute is deduplicated through `cron_key` and `scheduled_at`.

## Retry Contract

Jobs execute at least once and may execute again after handler errors, process crashes, database interruptions, or expired leases.

- `maxAttempts` counts total claims, not retries after the first attempt; it defaults to `3`.
- A numeric `retry` is a fixed delay in milliseconds.
- A retry object uses exponential backoff with defaults `delay: 30000`, `multiplier: 2`, and `maxDelay: 300000` milliseconds.
- A retry function receives `{ error, job, attempt }` and returns a delay in milliseconds or a specific `Date`.
- Handler errors are persisted on the row; `worker.poll()` handles them instead of rethrowing the handler failure.
- A missing `.job.ts` handler is recorded as a normal job failure and follows the row's attempt policy.

Prefer idempotent writes, unique constraints, idempotency keys, and explicit state transitions. Do not treat enqueue deduplication as exactly-once execution.

## Lease Contract

Claiming a job increments `attempts` and writes a unique `lease_id`, `locked_by`, and `locked_until`.

- Only the worker holding the current `lease_id` may complete or fail that claim.
- An expired running job is reclaimable only while `attempts < max_attempts`.
- An expired lease at the attempt limit is marked `failed`, clears its lock fields, and is not reclaimed.
- Size `leaseSeconds` for the expected handler duration. A lease shorter than normal work time can cause concurrent retry of a still-running side effect.

## Deterministic Validation

- call `scheduler.tick(fixedDate)` instead of starting timer loops
- test the configured IANA timezone at a fixed instant
- cover a single-value step such as `5/10`
- cover day-of-month/day-of-week OR behavior and the wildcard cases
- tick the same minute twice and assert one persisted cron row
- simulate an expired retryable lease and assert it is reclaimed without exceeding `maxAttempts`
- simulate an expired final-attempt lease and assert it becomes `failed`
- assert retry rows contain the expected `attempts`, `last_error`, and next `run_at`
