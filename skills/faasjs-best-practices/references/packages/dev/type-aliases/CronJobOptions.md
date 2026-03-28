[@faasjs/dev](../README.md) / CronJobOptions

# Type Alias: CronJobOptions

> **CronJobOptions** = `object`

Options for creating a [CronJob](../classes/CronJob.md).

## Properties

### expression

> **expression**: `string`

Cron expression in 5-field format:
minute hour dayOfMonth month dayOfWeek

Supported syntax per field: wildcard (`*`), step (every n units), and fixed number.

### handler

> **handler**: [`CronJobHandler`](CronJobHandler.md)

Callback invoked whenever the cron expression matches.

### logger?

> `optional` **logger?**: `Logger`

Custom logger used by this cron job.

### name?

> `optional` **name?**: `string`

Optional job name used in logs and registry helpers.

#### Default

```ts
random generated name
```

### onError?

> `optional` **onError?**: [`CronJobErrorHandler`](CronJobErrorHandler.md)

Error handler invoked when `handler` throws.
