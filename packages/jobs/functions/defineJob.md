[**@faasjs/jobs**](../README.md)

[@faasjs/jobs](../README.md) / defineJob

# Function: defineJob()

> **defineJob**\<`TSchema`, `TContext`, `THandler`>>>>\>(`options`): [`Job`](../classes/Job.md)\<`TSchema`, `TContext`, `Awaited`\<`ReturnType`\<`THandler`>>>>>>>>>>>>\>\>\>

Define a PostgreSQL-backed background job.

The returned job can be loaded from a `.job.ts` file by `startJobWorker`
and `startJobScheduler`. When `schema` is provided, handler `params` are
inferred from the schema output type. Without `schema`, handler `params` are
typed as `Record<string, never>`.

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

Job schema, defaults, cron rules, retry strategy, and handler.

## Returns

[`Job`](../classes/Job.md)\<`TSchema`, `TContext`, `Awaited`\<`ReturnType`\<`THandler`\>\>\>

A [Job](../classes/Job.md) instance with normalized queue, retry, and cron metadata.

## Example

```ts
import { defineJob } from '@faasjs/jobs'
import { z } from '@faasjs/utils'

export default defineJob({
  schema: z.object({ userId: z.string() }),
  async handler({ params, job, attempt, logger }) {
    logger.info('Sync %s from job %s attempt %s', params.userId, job.id, attempt)
  },
})
```
