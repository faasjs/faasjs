[@faasjs/jobs](../README.md) / JobRecord

# Type Alias: JobRecord

> **JobRecord** = `object`

Persisted row from the `faasjs_jobs` table.

## Properties

### attempts

> **attempts**: `number`

### completed\_at

> **completed\_at**: `Date` \| `string` \| `null`

### created\_at

> **created\_at**: `Date` \| `string`

### cron\_key

> **cron\_key**: `string` \| `null`

### failed\_at

> **failed\_at**: `Date` \| `string` \| `null`

### id

> **id**: `string`

### idempotency\_key

> **idempotency\_key**: `string` \| `null`

### job\_path

> **job\_path**: `string`

### last\_error

> **last\_error**: `string` \| `null`

### lease\_id

> **lease\_id**: `string` \| `null`

### locked\_by

> **locked\_by**: `string` \| `null`

### locked\_until

> **locked\_until**: `Date` \| `string` \| `null`

### max\_attempts

> **max\_attempts**: `number`

### params

> **params**: `unknown`

### priority

> **priority**: `number`

### queue

> **queue**: `string`

### run\_at

> **run\_at**: `Date` \| `string`

### scheduled\_at

> **scheduled\_at**: `Date` \| `string` \| `null`

### status

> **status**: [`JobStatus`](JobStatus.md)

### updated\_at

> **updated\_at**: `Date` \| `string`
