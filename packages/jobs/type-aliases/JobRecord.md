[@faasjs/jobs](../README.md) / JobRecord

# Type Alias: JobRecord

> **JobRecord** = `object`

Persisted row from the `faasjs_jobs` table.

## Properties

### attempts

> **attempts**: `number`

Number of attempts already claimed.

### completed\_at

> **completed\_at**: `Date` \| `string` \| `null`

Completion timestamp.

### created\_at

> **created\_at**: `Date` \| `string`

Row creation timestamp.

### cron\_key

> **cron\_key**: `string` \| `null`

Optional cron hash used to deduplicate scheduler rows by minute.

### failed\_at

> **failed\_at**: `Date` \| `string` \| `null`

Final failure timestamp.

### id

> **id**: `string`

Unique job row id.

### idempotency\_key

> **idempotency\_key**: `string` \| `null`

Optional idempotency key used to deduplicate manual enqueues.

### job\_path

> **job\_path**: `string`

Path-derived `.job.ts` identifier.

### last\_error

> **last\_error**: `string` \| `null`

Last failure message or stack.

### lease\_id

> **lease\_id**: `string` \| `null`

Lease id used to complete or fail the claimed row.

### locked\_by

> **locked\_by**: `string` \| `null`

Worker id currently holding the lease.

### locked\_until

> **locked\_until**: `Date` \| `string` \| `null`

Time when the current lease expires.

### max\_attempts

> **max\_attempts**: `number`

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

### run\_at

> **run\_at**: `Date` \| `string`

Earliest time this row may be claimed.

### scheduled\_at

> **scheduled\_at**: `Date` \| `string` \| `null`

Minute timestamp associated with a scheduler enqueue.

### status

> **status**: [`JobStatus`](JobStatus.md)

Current lifecycle status.

### updated\_at

> **updated\_at**: `Date` \| `string`

Row update timestamp.
