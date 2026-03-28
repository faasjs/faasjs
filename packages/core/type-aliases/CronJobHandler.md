[@faasjs/core](../README.md) / CronJobHandler

# Type Alias: CronJobHandler

> **CronJobHandler** = (`context`) => `void` \| `Promise`\<`void`\>

Handler invoked when a cron expression matches the current minute.

## Parameters

### context

[`CronJobContext`](CronJobContext.md)

Runtime context for the current execution.

## Returns

`void` \| `Promise`\<`void`\>

Promise or void returned by the handler.
