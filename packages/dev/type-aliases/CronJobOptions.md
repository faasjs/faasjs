[@faasjs/dev](../README.md) / CronJobOptions

# Type Alias: CronJobOptions

> **CronJobOptions** = `object`

## Properties

### expression

> **expression**: `string`

Cron expression in 5-field format:
minute hour dayOfMonth month dayOfWeek

Supported syntax per field: wildcard (`*`), step (every n units), and fixed number.

### handler

> **handler**: [`CronJobHandler`](CronJobHandler.md)

Job handler.

### logger?

> `optional` **logger**: `Logger`

Custom logger for this cron job.

### name?

> `optional` **name**: `string`

Name of the cron job, used in logs.

#### Default

```ts
random name
```

### onError?

> `optional` **onError**: [`CronJobErrorHandler`](CronJobErrorHandler.md)

Called when handler throws.
