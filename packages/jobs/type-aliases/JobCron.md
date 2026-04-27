[@faasjs/jobs](../README.md) / JobCron

# Type Alias: JobCron\<TParams\>

> **JobCron**\<`TParams`\> = `object`

Cron rule that enqueues a job with optional schema-typed params.

## Type Parameters

### TParams

`TParams` = `Record`\<`string`, `never`\>

## Properties

### expression

> **expression**: `string`

### maxAttempts?

> `optional` **maxAttempts?**: `number`

### params?

> `optional` **params?**: `TParams`

Params passed to the job when this cron rule enqueues it.

### priority?

> `optional` **priority?**: `number`

### queue?

> `optional` **queue?**: `string`

### timezone?

> `optional` **timezone?**: `string`
