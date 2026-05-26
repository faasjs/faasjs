[@faasjs/jobs](../README.md) / EnqueueJobOptions

# Type Alias: EnqueueJobOptions

> **EnqueueJobOptions** = `object`

Options for [enqueueJob](../functions/enqueueJob.md).

## Properties

### idempotencyKey?

> `optional` **idempotencyKey?**: `string`

Idempotency key. Jobs with the same key are only inserted once.
Used to prevent duplicate enqueues for the same logical operation.

### maxAttempts?

> `optional` **maxAttempts?**: `number`

Maximum execution attempts. Defaults to `3`.

### priority?

> `optional` **priority?**: `number`

Execution priority. Higher values run first. Defaults to `0`.

### queue?

> `optional` **queue?**: `string`

Queue name. Defaults to `'default'`.

### runAt?

> `optional` **runAt?**: `Date`

Earliest time the job should run. Defaults to now.
