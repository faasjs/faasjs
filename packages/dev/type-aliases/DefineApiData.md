[@faasjs/dev](../README.md) / DefineApiData

# Type Alias: DefineApiData\<TSchema, TEvent, TContext, TResult\>

> **DefineApiData**\<`TSchema`, `TEvent`, `TContext`, `TResult`\> = [`InvokeData`](InvokeData.md)\<`TEvent`, `TContext`, `TResult`\> & `object` & `DefineApiInject`

Handler data passed to [defineApi](../functions/defineApi.md).

Extends the normal invoke data with validated `params`, `cookie`, `session`,
and any plugin-provided fields declared through `DefineApiInject`.

## Type Declaration

### cookie

> **cookie**: [`Cookie`](../classes/Cookie.md)

Cookie helper injected by the HTTP plugin.

### params

> **params**: `TSchema` _extends_ `ZodType` ? `output`\<`NonNullable`\<`TSchema`\>\> : `Record`\<`string`, `never`\>

Params validated by the optional Zod schema.

### session

> **session**: [`Session`](../classes/Session.md)

Session helper injected by the HTTP plugin.

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType` \| `undefined` = `undefined`

Zod schema used to validate `event.params`.

### TEvent

`TEvent` = `any`

Raw event type passed to the function.

### TContext

`TContext` = `any`

Runtime context type.

### TResult

`TResult` = `any`

Handler return type.
