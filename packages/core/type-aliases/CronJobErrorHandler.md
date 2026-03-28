[@faasjs/core](../README.md) / CronJobErrorHandler

# Type Alias: CronJobErrorHandler

> **CronJobErrorHandler** = (`error`, `context`) => `void` \| `Promise`\<`void`\>

Error handler invoked when a cron job throws.

## Parameters

### error

`Error`

Error thrown by the cron handler.

### context

[`CronJobContext`](CronJobContext.md)

Runtime context for the failed execution.

## Returns

`void` \| `Promise`\<`void`\>

Promise or void returned by the error handler.
