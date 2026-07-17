[**@faasjs/jobs**](../README.md)

[@faasjs/jobs](../README.md) / DefineJobData

# Type Alias: DefineJobData\<TSchema, TContext, TResult\>

> **DefineJobData**\<`TSchema`, `TContext`, `TResult`> > > > > > \> = `InvokeData`\<[`JobEvent`](JobEvent.md)\<`TSchema`>>>>>>\>, `TContext`, `TResult`> > > > > > \> & `object` & [`DefineJobInject`](../interfaces/DefineJobInject.md)

Handler data passed to [defineJob](../functions/defineJob.md).

## Type Declaration

### attempt

> **attempt**: `number`

Current execution attempt, starting at `1`.

### job

> **job**: [`JobRecord`](JobRecord.md)

Persisted job row. Direct tests receive deterministic defaults when omitted.

### params

> **params**: [`DefineJobParams`](DefineJobParams.md)\<`TSchema`>>>>>>\>

Params validated by the optional Zod schema.

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType` \| `undefined` = `undefined`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`
