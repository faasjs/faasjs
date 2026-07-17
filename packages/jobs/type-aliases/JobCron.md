[**@faasjs/jobs**](../README.md)

[@faasjs/jobs](../README.md) / JobCron

# Type Alias: JobCron\<TParams\>

> **JobCron**\<`TParams`> > > > > > \> = `object`

Cron rule that enqueues a job with optional schema-typed params.

## Type Parameters

### TParams

`TParams` = `Record`\<`string`, `never`\>

## Properties

### expression

> **expression**: `string`

Cron expression string (5-field format: minute hour day month weekday).

### maxAttempts?

> `optional` **maxAttempts?**: `number`

Maximum execution attempts for this cron rule.

### params?

> `optional` **params?**: `TParams`

Params passed to the job when this cron rule enqueues it.

### priority?

> `optional` **priority?**: `number`

Execution priority for this cron rule.

### queue?

> `optional` **queue?**: `string`

Queue name. Defaults to the job's queue or `'default'`.

### timezone?

> `optional` **timezone?**: `string`

Optional IANA timezone (e.g. `'America/New_York'`).
