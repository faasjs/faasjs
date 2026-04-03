[@faasjs/dev](../README.md) / CronJobContext

# Type Alias: CronJobContext

> **CronJobContext** = `object`

Runtime context passed to cron job handlers.

## Properties

### job

> **job**: [`CronJob`](../classes/CronJob.md)

Cron job being executed.

### logger

> **logger**: `Logger`

Job-scoped logger instance.

### now

> **now**: `Date`

Current execution time used for the tick.
