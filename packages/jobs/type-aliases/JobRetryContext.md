[@faasjs/jobs](../README.md) / JobRetryContext

# Type Alias: JobRetryContext

> **JobRetryContext** = `object`

Context passed to a retry function after a job failure.

## Properties

### attempt

> **attempt**: `number`

The current attempt number (1-indexed).

### error

> **error**: `Error`

The error that caused the failure.

### job

> **job**: [`JobRecord`](JobRecord.md)

The job record at the time of failure.
