[**@faasjs/jobs**](../README.md)

[@faasjs/jobs](../README.md) / JobRetryOptions

# Type Alias: JobRetryOptions

> **JobRetryOptions** = `object`

Configuration for exponential backoff retry delays.

## Properties

### delay?

> `optional` **delay?**: `number`

Initial delay in milliseconds before the first retry. Defaults to `30000` (30s).

### maxDelay?

> `optional` **maxDelay?**: `number`

Maximum delay cap in milliseconds. Defaults to `300000` (5 min).

### multiplier?

> `optional` **multiplier?**: `number`

Multiplier applied to the delay on each subsequent retry. Defaults to `2`.
