[@faasjs/jobs](../README.md) / DefineJobData

# Type Alias: DefineJobData\<TPayload, TContext, TResult\>

> **DefineJobData**\<`TPayload`, `TContext`, `TResult`\> = `InvokeData`\<[`JobEvent`](JobEvent.md), `TContext`, `TResult`\> & `object` & [`DefineJobInject`](../interfaces/DefineJobInject.md)

## Type Declaration

### attempt

> **attempt**: `number`

### client

> **client**: `Client`

### job

> **job**: [`JobRecord`](JobRecord.md)

### payload

> **payload**: `TPayload`

## Type Parameters

### TPayload

`TPayload` = `Record`\<`string`, `any`\>

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`
