[@faasjs/jobs](../README.md) / DefineJobOptions

# Type Alias: DefineJobOptions\<TSchema, TContext, TResult\>

> **DefineJobOptions**\<`TSchema`, `TContext`, `TResult`> > > > \> = `object`

Options for [defineJob](../functions/defineJob.md).

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType` \| `undefined` = `undefined`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`

## Properties

### cron?

> `optional` **cron?**: [`JobCron`](JobCron.md)\<[`DefineJobParams`](DefineJobParams.md)\<`TSchema`>>>>>>>>\>\>[]

Cron rules that trigger scheduled invocations of this job.

### handler

> **handler**: (`data`) => `TResult` \| `Promise`\<`TResult`>>>>\>

The job handler function.

#### Parameters

##### data

[`DefineJobData`](DefineJobData.md)\<`TSchema`, `TContext`, `TResult`\>

#### Returns

`TResult` \| `Promise`\<`TResult`\>

### maxAttempts?

> `optional` **maxAttempts?**: `number`

Maximum execution attempts. Defaults to `3`.

### queue?

> `optional` **queue?**: `string`

Queue name. Defaults to `'default'`.

### retry?

> `optional` **retry?**: [`JobRetry`](JobRetry.md)

Retry strategy for failed attempts.

### schema?

> `optional` **schema?**: `TSchema`

Optional Zod schema used to validate and type handler params.
