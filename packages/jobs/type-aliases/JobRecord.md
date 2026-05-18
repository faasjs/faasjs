[@faasjs/jobs](../README.md) / JobRecord

# Type Alias: JobRecord

> **JobRecord** = `object`

Persisted row from the `faasjs_jobs` table.

## Properties

### attempts

> **attempts**: `number`

### completed_at

> **completed_at**: `Date` \| `string` \| `null`

### created_at

> **created_at**: `Date` \| `string`

### cron_key

> **cron_key**: `string` \| `null`

### failed_at

> **failed_at**: `Date` \| `string` \| `null`

### id

> **id**: `string`

### idempotency_key

> **idempotency_key**: `string` \| `null`

### job_path

> **job_path**: `string`

### last_error

> **last_error**: `string` \| `null`

### lease_id

> **lease_id**: `string` \| `null`

### locked_by

> **locked_by**: `string` \| `null`

### locked_until

> **locked_until**: `Date` \| `string` \| `null`

### max_attempts

> **max_attempts**: `number`

### params

> **params**: `unknown`

### priority

> **priority**: `number`

### queue

> **queue**: `string`

### run_at

> **run_at**: `Date` \| `string`

### scheduled_at

> **scheduled_at**: `Date` \| `string` \| `null`

### status

> **status**: [`JobStatus`](JobStatus.md)

### updated_at

> **updated_at**: `Date` \| `string`
