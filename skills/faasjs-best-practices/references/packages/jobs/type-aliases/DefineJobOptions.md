[@faasjs/jobs](../README.md) / DefineJobOptions

# Type Alias: DefineJobOptions\<TSchema, TContext, TResult\>

> **DefineJobOptions**\<`TSchema`, `TContext`, `TResult`\> = `object`

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType` \| `undefined` = `undefined`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`

## Properties

### cron?

> `optional` **cron?**: [`JobCron`](JobCron.md)\<[`DefineJobPayload`](DefineJobPayload.md)\<`TSchema`\>\>[]

### handler

> **handler**: (`data`) => `TResult` \| `Promise`\<`TResult`\>

#### Parameters

##### data

[`DefineJobData`](DefineJobData.md)\<[`DefineJobPayload`](DefineJobPayload.md)\<`TSchema`\>, `TContext`, `TResult`\>

#### Returns

`TResult` \| `Promise`\<`TResult`\>

### maxAttempts?

> `optional` **maxAttempts?**: `number`

### queue?

> `optional` **queue?**: `string`

### retry?

> `optional` **retry?**: [`JobRetry`](JobRetry.md)

### schema?

> `optional` **schema?**: `TSchema`
