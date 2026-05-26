[@faasjs/jobs](../README.md) / JobSchedulerOptions

# Type Alias: JobSchedulerOptions

> **JobSchedulerOptions** = [`LoadJobRegistryOptions`](LoadJobRegistryOptions.md) & `object`

Options for [startJobScheduler](../functions/startJobScheduler.md).

## Type Declaration

### pollInterval?

> `optional` **pollInterval?**: `number`

Milliseconds between cron ticks. Defaults to `30000` (30s).

### schedulerId?

> `optional` **schedulerId?**: `string`

Unique identifier for this scheduler instance. Auto-generated when omitted.
