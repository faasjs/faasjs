[@faasjs/core](../README.md) / DefineApiData

# Type Alias: DefineApiData\<TSchema, TEvent, TContext, TResult\>

> **DefineApiData**\<`TSchema`, `TEvent`, `TContext`, `TResult`\> = [`InvokeData`](InvokeData.md)\<`TEvent`, `TContext`, `TResult`\> & `object` & `DefineApiInject`

Handler data passed to [defineApi](../functions/defineApi.md).

Extends the normal invoke data with validated `params`, `cookie`, `session`,
and any plugin-provided fields declared through `DefineApiInject`.

## Type Declaration

### cookie

> **cookie**: [`Cookie`](../classes/Cookie.md)

### params

> **params**: `TSchema` _extends_ `ZodType` ? `output`\<`NonNullable`\<`TSchema`\>\> : `Record`\<`string`, `never`\>

### session

> **session**: [`Session`](../classes/Session.md)

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType` \| `undefined` = `undefined`

### TEvent

`TEvent` = `any`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`
