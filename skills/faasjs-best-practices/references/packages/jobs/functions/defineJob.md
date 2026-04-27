[@faasjs/jobs](../README.md) / defineJob

# Function: defineJob()

> **defineJob**\<`TSchema`, `TContext`, `THandler`\>(`options`): [`Job`](../classes/Job.md)\<`TSchema`, `TContext`, `Awaited`\<`ReturnType`\<`THandler`\>\>\>

Define a PostgreSQL-backed background job.

The returned job can be loaded from a `.job.ts` file by `startJobWorker`
and `startJobScheduler`.

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> \| `undefined` = `undefined`

### TContext

`TContext` = `any`

### THandler

`THandler` _extends_ (`data`) => `any` = (`data`) => `any`

## Parameters

### options

`Omit`\<[`DefineJobOptions`](../type-aliases/DefineJobOptions.md)\<`TSchema`, `TContext`, `Awaited`\<`ReturnType`\<`THandler`\>\>\>, `"handler"`\> & `object`

## Returns

[`Job`](../classes/Job.md)\<`TSchema`, `TContext`, `Awaited`\<`ReturnType`\<`THandler`\>\>\>
