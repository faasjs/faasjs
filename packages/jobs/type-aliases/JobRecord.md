[@faasjs/jobs](../README.md) / JobRecord

# Type Alias: JobRecord

> **JobRecord** = `object`

Persisted row from the `faasjs_jobs` table.

## Properties

### attempts

> **attempts**: `number`

Number of attempts already claimed.

### completed_at

> **completed_at**: `Date` \| `string` \| `null`

Completion timestamp.

### created_at

> **created_at**: `Date` \| `string`

Row creation timestamp.

### cron_key

> **cron_key**: `string` \| `null`

Optional cron hash used to deduplicate scheduler rows by minute.

### failed_at

> **failed_at**: `Date` \| `string` \| `null`

Final failure timestamp.

### id

> **id**: `string`

Unique job row id.

### idempotency_key

> **idempotency_key**: `string` \| `null`

Optional idempotency key used to deduplicate manual enqueues.

### job_path

> **job_path**: `string`

Path-derived `.job.ts` identifier.

### last_error

> **last_error**: `string` \| `null`

Last failure message or stack.

### lease_id

> **lease_id**: `string` \| `null`

Lease id used to complete or fail the claimed row.

### locked_by

> **locked_by**: `string` \| `null`

Worker id currently holding the lease.

### locked_until

> **locked_until**: `Date` \| `string` \| `null`

Time when the current lease expires.

### max_attempts

> **max_attempts**: `number`

Maximum attempts before permanent failure.

### params

> **params**: `unknown`

Serialized params passed to the job handler.

### priority

> **priority**: `number`

Higher priority rows are claimed before lower priority rows.

### queue

> **queue**: `string`

Queue this row is claimed from.

### run_at

> **run_at**: `Date` \| `string`

Earliest time this row may be claimed.

### scheduled_at

> **scheduled_at**: `Date` \| `string` \| `null`

Minute timestamp associated with a scheduler enqueue.

### status

> **status**: [`JobStatus`](JobStatus.md)

Current lifecycle status.

### updated_at

> **updated_at**: `Date` \| `string`

Row update timestamp.
